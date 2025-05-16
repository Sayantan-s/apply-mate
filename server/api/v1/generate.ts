import { GoogleGenAI, Type } from "@google/genai";
import { Stagehand } from "@browserbasehq/stagehand";
import z from "zod";
import path from "path";

const API_KEY = "AIzaSyA4qjKde5KndRZ0Sd81A8VIeWTkOYCFkEQ";

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  required: ["score", "missing_skills", "matching_skills", "explanation"],
  properties: {
    score: {
      type: Type.INTEGER,
    },
    missing_skills: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },
    matching_skills: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },
    explanation: {
      type: Type.STRING,
    },
  },
};

async function extractJDPageContent(url: string) {
  const stagehand = new Stagehand({
    env: "LOCAL",
    modelName: "gemini-2.0-flash",
    modelClientOptions: {
      apiKey: API_KEY,
    },
    localBrowserLaunchOptions: {
      executablePath:
        "/Users/Sayantan/Documents/ai-rest/chrome/mac_arm-136.0.7103.94/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
    },
  });
  await stagehand.init();

  const page = stagehand.page;

  await page.goto(url, { timeout: 60000 });

  const PROMPT = `
      You are smart machine that understands and extracts contents from webpages.
      Below content should be a JD of a certain job.
      As I mentioned "Should", there can be posibility that you might a find a different webpage which might not be a JD page of example it can be a login page, a shopping card.

      Rules:

      > If you don't find the webpage as JD of job you can throw an error.
      > Extract only the required job description, strictly donot extract unwanted things like about the company etc.

      Strictly follow this json format output::
      
      Success:

      {
        message: 'SUCCESS',
        data: "<Extracted Content Of the JD>" // for e.g. This is a key role within the Global Deal Desk team, which owns deal strategy, quote-to-cash execution, and pricing operations. You’ll work closely with sales, product, legal, and operations teams to ensure that CPQ changes reflect business prior....
      }
      
      Error:

      {
        message: 'ERROR',
        data: "<Error Message>" // add error reason in this data property like -> UNKNOWN PAGE, DIFFICULT TO REACH, BLOCKERS CAME UP etc
      }
    
    `;

  await page.act({
    action:
      "If any popup / modal / dialog is found on the screen try to close it!",
  });

  const { message, data } = await page.extract({
    instruction: PROMPT,
    schema: z.object({
      message: z.string(),
      data: z.string(),
    }),
  });

  await stagehand.close();

  if (message === "ERROR") throw new Error(data);

  return data;
}

export default defineEventHandler(async (event) => {
  if (event.node.req.method === "POST") {
    const ai = new GoogleGenAI({
      apiKey: API_KEY,
    });

    const formData = await readMultipartFormData(event);

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "No files uploaded",
      });
    }

    const [url, file] = formData;

    const storage = useStorage("uploads");

    const fileName = `${Date.now()}-${file.filename}`;

    await storage.setItemRaw(`${fileName}`, file.data);

    const candidateResume = path.resolve(
      `/Users/Sayantan/Documents/ai-rest/public/uploads/${fileName}`
    );

    const JD_URL = url.data.toString("utf-8");

    const jd = await extractJDPageContent(JD_URL);

    const files = [await ai.files.upload({ file: candidateResume })];

    const config = {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    };

    const ANALYSER_PROMPT = `
      You are an ATS machine that judges candidates based on JDs provided to you.
      Below is the JD of the job. \n

      ${jd}

      \n
      
      Do these following tasks taking reference from the above jd and file input :-

      > Analyse the candidate resume given as an input
      > Check if the candidate is fit for the job or not.
      > Rate the candidate based on the below structure.

      Note:: assess the score logic in this manner -> score < 40 = POOR, score > 40 && score < 70 = AVERAGE, score > 70 && score < 90 = GOOD, score > 100 = GREAT

      {
        score: 82 (Rating out of "100" based on the case how much it matches)
        matching_skills: ["React", "Redux" ...] (add the similar skills you found on the resume as well as the jd, leave empty if not found any)
        missing_skills: ["Microfrontend", "PWA"] (add those skills which you think the candidate is missing and made him not to stand out, leave empty if not found any)
        explanation: Candidate is a great match... (Give the reasons why is rated according to the score i.e. if he is rated 40 why is he rated so poorly, if 72 why is he rated as good)
      }

    `;

    const contents = [
      {
        role: "user",
        parts: [
          {
            fileData: {
              fileUri: files[0].uri,
              mimeType: files[0].mimeType,
            },
          },
          { text: ANALYSER_PROMPT },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
      config,
    });

    if (!response.text)
      throw createError({
        message: "Failed to generate text",
        statusCode: 400,
      });

    const data = JSON.parse(response.text);

    return { data };
  }
});
