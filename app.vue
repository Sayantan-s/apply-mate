<script setup lang="ts">
import { ZodError } from "zod";
import useMutation from "./composables/hooks/useMutation";
import type { IToastProps } from "./components/Toast/index.vue";

interface IJDInputForm {
  jd: string;
  file: File | null;
}

interface IJDMatchStatusResponse {
  fileId: string;
}

const DUMMY = {
  file_id: "478216fa707adf45c052f4e690ba025f",
  jd: "Job description: Frontend Developer\n\nLocation: Yelahanka, Bangalore\n\nYou Will\n\nWe are seeking a passionate and detail-oriented Frontend Developer with 1–2 years of professional experience to join our growing tech team. You will be responsible for building and maintaining user-facing features, ensuring seamless performance, and delivering high-quality code. If you're eager to learn, grow, and contribute to exciting projects, we’d love to hear from you.\n\nTo Be Successful, You Will Be Expected To\n\n• Develop responsive, user-friendly web interfaces using modern frameworks ( React / Nextjs).\n• Collaborate with UX/UI designers and backend developers to implement high-quality web applications.\n• Optimize components for maximum performance across a vast array of web-capable devices and browsers.\n• Maintain code quality through unit testing, code reviews, and documentation.\n• Assist in troubleshooting and debugging issues, identifying root causes and proposing solutions.\n• Stay updated with the latest frontend technologies, trends, and best practices.\n\nYou must have any or a combination of any of the following skills:\n\n• 1–2 years of professional experience in frontend development.\n• Strong understanding of HTML5, CSS3, JavaScript (ES6+).\n• Experience with one or more modern frontend frameworks/libraries such as React, NextJS, Vue.js, or Angular.\n• Familiarity with version control systems, particularly Git.\n• Understanding of responsive design principles and cross-browser compatibility.\n• Basic knowledge of RESTful APIs, GraphQL APIs and integration techniques.\n• Knowledge of TypeScript\n• Experience with frontend build tools like Webpack, Vite, or Parcel.\n• Exposure to UI testing frameworks (e.g., Jest, Testing Library, Cypress).\n• Basic understanding of SEO, accessibility, and web performance principles.\n\nWhy Join Us?\n\n• Be part of India’s fast-growing EV revolution.\n• Work with a passionate team committed to sustainability and innovation.\n• Opportunity to shape the brand identity of a leading EV startup\n\nSkills: graphql,testing library,web,javascript (es6+),html5,angular,jest,parcel,vue.js,code,css3,react,git,restful apis,nextjs,typescript,frontend development,vite,cypress,webpack",
  score: 88,
  missing_skills: ["Angular", "Vue.js", "Cypress", "Accessibility"],
  matching_skills: [
    "React",
    "Nextjs",
    "HTML/CSS/SASS",
    "JavaScript (ES6+)",
    "TypeScript",
    "Git (Github Actions)",
    "REST/GraphQL/Ws",
    "Webpack",
    "Vite",
    "Jest",
    "Testing Library (RTL)",
    "Web performance optimization",
    "Responsive design",
    "Frontend development",
  ],
  explanation:
    "The candidate is a strong fit for the Frontend Developer role. With 2.5 years of experience, they slightly exceed the 1-2 year requirement but align well with the expected level. They demonstrate extensive experience with core required technologies like React, Next.js, TypeScript, JavaScript, HTML, CSS, Git, RESTful/GraphQL APIs, frontend build tools (Vite, Webpack), and testing frameworks (Jest, RTL). Their experience clearly shows capabilities in building responsive user interfaces, optimizing performance (Core Web Vitals, load time), collaborating, and maintaining code quality. While they don't list experience with Angular, Vue.js, or Cypress, the JD allows for a combination of skills, and their proficiency in the other required areas makes them a highly relevant candidate.",
};

const [jdMatch, { loading }] = useMutation<IJDMatchStatusResponse>(
  "/api/v1/jdmatch",
  "POST"
);
console.log("loading", loading);

const form = useState<IJDInputForm>("jdInputForm", () => ({
  jd: "",
  file: null,
}));

const tab = useState("tab", () => "tab2");

const fileId = useState<string | null>("fileId", () => null);
const status = useState<JDMATCH_STATUS>("status", () => JDMATCH_STATUS.IDLE);
const jdMatchInfo = useState<JDMatchInfoResponse>(
  "jdMatchInfo",
  () => ({} as JDMatchInfoResponse)
);
const toast = useState<IToastProps>("open", () => ({
  open: false,
  variant: "info",
  title: "",
  description: "",
}));
const timer = ref<NodeJS.Timeout | null>(null);

const dispatchToast = (
  variant: IToastProps["variant"],
  title: string,
  description: string
) => {
  toast.value.open = true;
  toast.value.variant = variant;
  toast.value.title = title;
  toast.value.description = description;
  timer.value = setTimeout(removeToast, 3000);
};

const removeToast = () => {
  toast.value.open = false;
  toast.value.variant = "info";
  toast.value.title = "";
  toast.value.description = "";
  clearTimeout(timer.value as NodeJS.Timeout);
  timer.value = null;
};

const handleChange = async (file: File | null) => {
  try {
    await jdDocSchema.parseAsync(file);
    form.value.file = file;
  } catch (err) {
    if (err instanceof ZodError) {
      console.error("Validation error:", err.errors);
    } else {
      console.error("Unexpected error:", err);
    }
  }
};

const handleSubmit = async () => {
  try {
    await jdFormSchema.parseAsync(form.value);
    const formData = new FormData();
    formData.append("url", form.value.jd);
    formData.append("file", form.value.file as Blob);
    const data = await jdMatch(formData);
    if (!data) return;
    fileId.value = data.fileId;
    await checkJDMatchStatus();
    await getJDMatchData();
  } catch (err) {
    if (err instanceof ZodError) {
      dispatchToast(
        "error",
        "Incorrect Input",
        err.errors.map((e) => e.message).join(", ")
      );
    } else {
      if (err === "jd_match_status") {
        dispatchToast(
          "error",
          "JD Match Status Error",
          "Error checking JD match status"
        );
      } else {
        dispatchToast(
          "error",
          "Unexpected Error",
          "An unexpected error occurred"
        );
      }
    }
  }
};

const checkJDMatchStatus = () =>
  new Promise<void>((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const res = await $fetch(`/api/v1/jdmatch/status/${fileId.value}`, {
          method: "GET",
        });

        if (res && typeof res === "object" && res !== null && "status" in res) {
          status.value = res.status;
          if (res?.data?.jd) {
            jdMatchInfo!.value!.jd = res.data.jd;
            tab.value = "tab2";
          }
          if (status.value === JDMATCH_STATUS.MATCHED) {
            clearInterval(interval);
            resolve();
          }
        }
      } catch (error) {
        console.error("Error checking status:", error);
        clearInterval(interval);
        reject("jd_match_status");
      }
    }, 1500);
  });

const getJDMatchData = async () => {
  try {
    const res = await $fetch(`/api/v1/jdmatch/score/${fileId.value}`, {
      method: "GET",
    });

    if (res && typeof res === "object" && res !== null) jdMatchInfo.value = res;
  } catch (error) {
    console.error("Error fetching JD match data:", error);
  }
};

const handleChangeTabs = (value: string) => () => {
  if (value === "tab2" && !jdMatchInfo.value.score) return;
  tab.value = value;
};

const baseFileInputStyles = computed(() => [
  "bg-black w-max px-4 py-3 border-2 border-black flex-1 flex flex-col justify-center",
  loading || fileId.value ? "hidden" : "",
]);

const baseButtonStyles = computed(() => [
  "border-2 justify-center px-8 py-2 border-black aspect-video text-shadow-md gap-2 flex items-center h-20",
  loading || fileId.value ? "flex-1" : "",
  status.value === JDMATCH_STATUS.MATCHED ? "bg-green-600" : "bg-purple-500",
]);

const scoreTabStyles = computed(() => [
  "flex-1 flex items-center gap-2 justify-center py-4 bg-black border-b-2 border-black aria-selected:bg-amber-100 aria-selected:text-black",
  jdMatchInfo.value.score ? "text-white" : "text-white/40",
]);
</script>

<template>
  <ToastProvider>
    <main
      class="flex items-center h-screen bg-white not-prose w-full items-center justify-center z-15 relative border-2 mb-5 min-h-[200px] border-border bg-[linear-gradient(to_right,#8080804D_1px,transparent_1px),linear-gradient(to_bottom,#80808090_1px,transparent_1px)] shadow-shadow [background-size:30px_30px] bg-secondary-background"
    >
      <div class="w-full flex flex-col">
        <TabsRoot
          :model-value="tab"
          class="max-w-[800px] max-h-[700px] overflow-y-scroll mx-auto w-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <TabsList class="flex">
            <TabsTrigger
              value="tab1"
              class="flex-1 flex items-center gap-2 justify-center py-4 bg-black text-white border-b-2 border-black aria-selected:bg-amber-100 aria-selected:text-black"
              @click="handleChangeTabs('tab1')"
            >
              <Icon name="uil:process" class="size-6" /> Process
            </TabsTrigger>
            <TabsTrigger
              value="tab2"
              :disabled="!!jdMatchInfo.score"
              :class="scoreTabStyles"
              @click="handleChangeTabs('tab1')"
              >Score <Icon name="uil:chart-pie" class="size-6"
            /></TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <form class="p-10 bg-amber-100" @submit.prevent="handleSubmit">
              <textarea
                v-model.trim="form.jd"
                rows="20"
                placeholder="eg. Paste your JD link or description here"
                class="w-full border-2 border-black p-4 mb-4 resize-none outline-black"
                :disabled="loading"
                :readonly="status !== JDMATCH_STATUS.IDLE || loading"
              />
              <FileInput
                input-parent-class-name="flex justify-between"
                :file="form.file"
                accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword"
                @change="handleChange"
              >
                <template #default="{ trigger }">
                  <div
                    role="button"
                    :class="baseFileInputStyles"
                    @click="trigger"
                  >
                    <p class="text-purple-400">
                      {{ form.file?.name || "Browse Files" }}
                    </p>
                    <p v-if="form.file" class="text-xs text-gray-100">
                      <span class="text-gray-500">File size:</span>
                      {{ (form.file.size / 1024 / 1024).toFixed(2) }} MB
                    </p>
                    <p v-else class="text-xs text-gray-100">
                      <span class="text-gray-500">PDF, DOC, DOCX.</span> File
                      size max 3mb
                    </p>
                  </div>
                  <button
                    :class="baseButtonStyles"
                    :disabled="
                      loading || (!!fileId && status !== JDMATCH_STATUS.MATCHED)
                    "
                  >
                    <Loading
                      v-if="
                        loading || (fileId && status !== JDMATCH_STATUS.MATCHED)
                      "
                    />
                    {{
                      loading
                        ? "Processing"
                        : fileId
                        ? JDMATCH_STATUS_TEXT[status]
                        : "Proceed"
                    }}
                  </button>
                </template>
              </FileInput>
            </form>
          </TabsContent>
          <TabsContent value="tab2"
            ><div class="p-10 bg-amber-100">
              <Result :data="DUMMY" />
            </div>
          </TabsContent>
        </TabsRoot>

        <!-- <div v-if="jdMatchInfo">
          {{ JSON.stringify(jdMatchInfo) }}
        </div> -->
      </div>
    </main>
    <Toast
      :open="toast.open"
      :description="toast.description"
      :title="toast.title"
      :variant="toast.variant"
      @close="removeToast"
    />
  </ToastProvider>
</template>

<style>
:root {
  --display: "Space Grotesk";
}

* {
  font-family: var(--display);
}
</style>
