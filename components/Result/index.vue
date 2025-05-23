<script setup lang="ts">
interface IProps {
  data: JDMatchInfoResponse;
}

const { data } = defineProps<IProps>();
</script>

<template>
  <ResultRatingCard :resume-name="data.file_name" :score="data.score" />

  <div class="mt-4">
    <ResultHeading text="Job Description" class="flex justify-end" />
    <textarea
      :value="data.jd"
      rows="10"
      placeholder="eg. Paste your JD link or description here"
      class="w-full border-2 border-black p-4 resize-none outline-black bg-white"
      disabled
      readonly
    />
  </div>
  <div class="space-y-6">
    <div class="mt-4">
      <ResultHeading text="Matching Skills" />
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
    <hr class="border-t-2 border-black" />
    <div>
      <ResultHeading text="Missing Skills" />
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
    <hr class="border-t-2 border-black" />

    <div>
      <ResultHeading text="Explanation" />
      <p>{{ data.explanation }}</p>
    </div>
  </div>
</template>
