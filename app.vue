<script setup lang="ts">
interface IJDInputForm {
  jd: string;
  file: File | null;
}

const form = reactive<IJDInputForm>({
  jd: "",
  file: null,
});

const handleChange = (eve: Event) => {
  const target = eve.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    form.file = target.files[0];
  }
};

const handleSubmit = async () => {
  console.log("form", form);
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <textarea
      v-model.trim="form.jd"
      type="text"
      placeholder="eg. Add jd link or jd text"
    />
    <input type="file" @change="handleChange" />
    <button class="bg-red-500">Proceed</button>
  </form>
</template>
