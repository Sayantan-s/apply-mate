<script setup lang="ts">
interface IProps {
  data: JDMatchInfoResponse;
}

const { data } = defineProps<IProps>();
</script>

<template>
  <div class="border-b-2 border-black">
    <div class="flex items-center border-2 border-black gap-4 mb-4">
      <div
        class="w-24 aspect-square bg-white border-r-2 border-black text-4xl flex items-center justify-center"
      >
        {{ data.score }} <sup class="text-xs text-gray-500">/ 100</sup>
      </div>
      <div>
        <strong>Feedback</strong>
        <p class="text-sm">
          Your are highly recommended for this job! <br />
          <span class="text-purple-700">X.pdf</span> is highly recommended!
        </p>
      </div>
    </div>
  </div>

  <div class="mt-4">
    <h1 class="text-xl mb-2 text-right">Job Description</h1>
    <textarea
      :value="data.jd"
      rows="10"
      placeholder="eg. Paste your JD link or description here"
      class="w-full border-2 border-black p-4 resize-none outline-black bg-white"
      disabled
      readonly
    />
  </div>
  <div class="space-y-4">
    <div class="mt-4">
      <h1 class="text-xl mb-2 flex items-center gap-2">Matching Skills</h1>
      <div class="flex gap-1 flex-wrap">
        <div
          v-for="(skill, index) in data.matching_skills"
          :key="index"
          class="bg-black text-white px-3 py-1 text-sm"
          role="button"
        >
          {{ skill }}
        </div>
      </div>
    </div>
    <div>
      <h1 class="text-xl mb-2 flex items-center gap-2">Missing Skills</h1>
      <div class="flex gap-1 flex-wrap">
        <div
          v-for="(skill, index) in data.missing_skills"
          :key="index"
          class="bg-transparent text-black border-2 border-black px-3 py-1 text-sm"
          role="button"
        >
          {{ skill }}
        </div>
      </div>
    </div>
    <div>
      <h1 class="text-xl mb-2 flex items-center gap-2">Explanation</h1>
      <p>{{ data.explanation }}</p>
    </div>
  </div>
</template>
