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

const handleChange = (eve: Event) => {
  const target = eve.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    form.value.file = target.files[0];
  }
};

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append("url", form.value.jd);
  formData.append("file", form.value.file as Blob);
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
  <form class="max-w-2xl mx-auto" @submit.prevent="handleSubmit">
    <textarea
      v-model.trim="form.jd"
      type="text"
      placeholder="eg. Paste your JD link or description here"
      class="w-full h-32 border-2 border-gray-300 rounded-md p-2 mb-4"
    />
    <input type="file" @input="handleChange" />
    <button
      class="bg-purple-500 px-4 py-3 border border-black disabled:bg-red-400"
      :disabled="loading"
    >
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
