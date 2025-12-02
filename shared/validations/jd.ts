import { z } from "zod";

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const jdDocSchema = import.meta.client
  ? z
      .instanceof(File, { message: "Please attatch your resume!" })
      .refine((file) => file.size > 0, { message: "File is required" })
      .refine((file) => file.size <= 3 * 1024 * 1024, {
        message: "Max file size is 3MB",
      })
      .refine((file) => allowedTypes.includes(file.type), {
        message: "Only PDF, DOC, DOCX files are allowed",
      })
  : z.any();

export const jdFormSchema = z.object({
  file: jdDocSchema.optional(),
  jd: z.string().min(20, { message: "JD is required" }),
  // cvLink: z.string().url({ message: "Valid CV link required" }).optional(),
});
// .superRefine((data, ctx) => {
//   const jdIsPopulatedAndPotentiallyValid =
//     typeof data.jd === "string" && data.jd.length >= 20;

//   if (jdIsPopulatedAndPotentiallyValid) {
//     const hasFile = !!data.file;
//     const hasCvLink =
//       typeof data.cvLink === "string" && data.cvLink.trim() !== "";

//     if (!hasFile && !hasCvLink) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message:
//           "Either a Resume File or a CV Link must be provided with the Job Description.",
//         path: ["file"],
//       });
//     }
//   }
// });
