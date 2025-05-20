<script setup lang="ts">
import { ZodError } from "zod";
import useMutation from "./composables/hooks/useMutation";

interface IJDInputForm {
  jd: string;
  file: File | null;
}

interface IJDMatchStatusResponse {
  fileId: string;
}

const [jdMatch, { loading }] = useMutation<IJDMatchStatusResponse>(
  "/api/v1/jdmatch",
  "POST"
);

const form = useState<IJDInputForm>("jdInputForm", () => ({
  jd: "",
  file: null,
}));

const fileId = useState<string | null>("fileId", () => null);
const status = useState<JDMATCH_STATUS>("status", () => JDMATCH_STATUS.IDLE);
const jdMatchInfo = useState<JDMatchInfoResponse | null>(
  "jdMatchInfo",
  () => null
);

const handleChange = async (file: File | null) => {
  try {
    console.log("File changed:", file, file instanceof File);
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
      console.error("Validation error:", err.errors);
    } else {
      console.error("Unexpected error:", err);
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
          status.value = (res as { status: JDMATCH_STATUS }).status;

          if (status.value === JDMATCH_STATUS.MATCHED) {
            clearInterval(interval);
            status.value = JDMATCH_STATUS.IDLE;
            resolve();
          }
        }
      } catch (error) {
        console.error("Error checking status:", error);
        clearInterval(interval);
        reject();
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
</script>

<template>
  <main class="flex items-center h-screen bg-amber-100">
    <div class="w-full">
      <form
        class="max-w-[700px] mx-auto p-10 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        @submit.prevent="handleSubmit"
      >
        <textarea
          v-model.trim="form.jd"
          type="text"
          rows="20"
          placeholder="eg. Paste your JD link or description here"
          class="w-full border-2 border-black p-4 mb-4 resize-none outline-black"
          :disabled="loading"
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
              class="bg-black w-max px-4 py-3 border-2 border-black flex-1"
              @click="trigger"
            >
              <p class="text-purple-400">
                {{ form.file?.name || "Browse Files" }}
              </p>
              <p class="text-xs text-gray-100">
                <span class="text-gray-500">PDF, DOC, DOCX.</span> File size max
                3mb
              </p>
            </div>
            <button
              class="bg-purple-500 border-2 px-8 py-2 border-black disabled:bg-red-400 aspect-video text-shadow-md"
              :disabled="loading"
            >
              <!-- <Loading /> -->
              {{ loading ? "Loading..." : "Proceed" }}
            </button>
          </template>
        </FileInput>
      </form>

      <div
        v-if="form.file"
        class="max-w-[700px] mt-10 mx-auto p-10 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <p>File: {{ form.file.name }}</p>
        <p>Status: {{ status }}...</p>
      </div>

      <div v-if="fileId">
        <p>File ID: {{ fileId }}</p>
        <p>Status: {{ status }}...</p>
      </div>

      <div v-if="jdMatchInfo">
        {{ JSON.stringify(jdMatchInfo) }}
      </div>
    </div>
  </main>
</template>

<style>
:root {
  --display: "Space Grotesk";
}

* {
  font-family: var(--display);
}
</style>
