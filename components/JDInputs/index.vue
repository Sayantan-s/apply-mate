<template>
  <form class="p-10 bg-amber-100" @submit.prevent="handleSubmit">
    <textarea
      v-model.trim="form.jd"
      rows="18"
      placeholder="eg. Paste your JD link or description here"
      class="w-full border-2 border-black p-4 mb-4 resize-none outline-black bg-white"
      :readonly="status !== JDMATCH_STATUS.IDLE || loading"
    />
    <FileInput
      input-parent-class-name="flex justify-between"
      :file="form.file"
      accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword"
      @change="handleChange"
    >
      <template #default="{ trigger }">
        <div role="button" :class="baseFileInputStyles" @click="trigger">
          <p class="text-purple-400">
            {{ form.file?.name || "Attach Resume" }}
          </p>
          <p v-if="form.file" class="text-xs text-gray-100">
            <span class="text-gray-500">File size:</span>
            {{ (form.file.size / 1024 / 1024).toFixed(2) }} MB
          </p>
          <p v-else class="text-xs text-gray-100">
            <span class="text-gray-500">PDF, DOC, DOCX.</span> File size max 3mb
          </p>
        </div>
        <button
          :class="baseButtonStyles"
          :disabled="
            loading ||
            (!!fileId && status !== JDMATCH_STATUS.MATCHED) ||
            (!!fileId && status !== JDMATCH_STATUS.FAILED)
          "
        >
          <Loading
            v-if="
              loading ||
              (!!fileId &&
                status !== JDMATCH_STATUS.MATCHED &&
                status !== JDMATCH_STATUS.FAILED)
            "
          />
          <Icon v-if="icon" :name="icon" class="size-7 text-black" />
          {{
            loading
              ? "Processing"
              : fileId
              ? JDMATCH_STATUS_TEXT[status]
              : "Proceed"
          }}
        </button>
        <button
          v-if="
            status === JDMATCH_STATUS.FAILED ||
            status === JDMATCH_STATUS.MATCHED
          "
          class="px-6 py-3 border-2 border-l-0 border-black min-w-xl bg-black text-white"
          @click="handleReset"
        >
          Reset
        </button>
      </template>
    </FileInput>
  </form>
</template>
