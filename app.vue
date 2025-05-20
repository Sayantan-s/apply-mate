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

const fileRef = ref<HTMLInputElement | null>(null);

const handleChange = async (eve: Event) => {
  const target = eve.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const [file] = target.files;
    try {
      await jdDocSchema.parseAsync({ file });
      form.value.file = target.files[0];
    } catch (err) {
      if (err instanceof ZodError) {
        console.error("Validation error:", err.errors);
      } else {
        console.error("Unexpected error:", err);
      }
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

const handleTriggerFile = (eve: Event) => {
  eve.preventDefault();
  eve.stopPropagation();
  console.log("trigger file", fileRef.value);
  if (fileRef.value) fileRef.value.click();
};

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
        class="max-w-[700px] mx-auto p-10 border-2 border-black"
        @submit.prevent="handleSubmit"
      >
        <textarea
          v-model.trim="form.jd"
          type="text"
          rows="20"
          placeholder="eg. Paste your JD link or description here"
          class="w-full border-2 border-black p-4 mb-4 resize-none outline-black"
        />
        <div class="flex justify-between">
          <div
            role="button"
            class="bg-black w-max px-4 py-3 border-2 border-black flex-1"
            @click="handleTriggerFile"
          >
            <p class="text-purple-400">
              {{ form.file?.name || "Browse Files" }}
            </p>
            <p class="text-xs text-gray-100">
              <span class="text-gray-500">PDF, DOC, DOCX.</span> File size max
              3mb
            </p>
            <input
              ref="fileRef"
              hidden
              type="file"
              accept=".pdf,.doc,.docx"
              @input="handleChange"
            />
          </div>
          <button
            class="bg-purple-500 border-2 px-8 py-2 border-black disabled:bg-red-400 aspect-video"
            :disabled="loading"
          >
            {{ loading ? "Loading..." : "Proceed" }}
          </button>
        </div>
      </form>
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
