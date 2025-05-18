<script setup lang="ts">
import useMutation from "./composables/hooks/useMutation";

interface IJDInputForm {
  jd: string;
  file: File | null;
}

interface IJDMatchResponse {
  fileId: string;
}

const [jdMatch, { loading }] = useMutation<IJDMatchResponse>(
  "/api/v1/jdmatch",
  "POST"
);

const form = reactive<IJDInputForm>({
  jd: "",
  file: null,
});

const fileId = ref<string | null>(null);
const status = ref<JDMATCH_STATUS>(JDMATCH_STATUS.IDLE);

const handleChange = (eve: Event) => {
  const target = eve.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    form.file = target.files[0];
  }
};

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append("url", form.jd);
  formData.append("file", form.file as Blob);
  const data = await jdMatch(formData);
  if (!data) return;
  fileId.value = data.fileId;
  await handleCheckStatus();
};

const handleCheckStatus = async () => {
  const interval = setInterval(async () => {
    try {
      const res = await $fetch(`/api/v1/jdmatch/status/${fileId.value}`, {
        method: "GET",
      });

      if (res) {
        status.value = res.status as JDMATCH_STATUS;

        if (status.value === JDMATCH_STATUS.MATCHED) {
          clearInterval(interval);
          status.value = JDMATCH_STATUS.IDLE;
        }
      }
    } catch (error) {
      console.error("Error checking status:", error);
      clearInterval(interval); // optional: stop polling on error
    }
  }, 1000); // 1 second interv
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <textarea
      v-model.trim="form.jd"
      type="text"
      placeholder="eg. Add jd link or jd text"
    />
    <input type="file" @input="handleChange" />
    <button class="bg-red-500 disabled:bg-red-400" :disabled="loading">
      {{ loading ? "Loading..." : "Proceed" }}
    </button>
  </form>
  <div v-if="fileId">
    <p>File ID: {{ fileId }}</p>
    <p>Status: {{ status }}...</p>
  </div>
</template>
