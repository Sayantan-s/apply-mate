<script setup lang="ts">
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

const form = reactive<IJDInputForm>({
  jd: "",
  file: null,
});

const fileId = ref<string | null>(null);
const status = ref<JDMATCH_STATUS>(JDMATCH_STATUS.IDLE);
const jdMatchInfo = ref<JDMatchInfoResponse | null>(null);

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
  await checkJDMatchStatus();
  await getJDMatchData();
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

  <div v-if="jdMatchInfo">
    {{ JSON.stringify(jdMatchInfo) }}
  </div>
</template>
