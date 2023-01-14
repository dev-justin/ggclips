<template>
  <Form
    @submit="submit"
    :validation-schema="uploadForm.schema"
    class="flex flex-col gap-4 text-purple-700"
  >
    <div class="grid sm:grid-cols-2 gap-2 sm:gap-3">
      <div>
        <label for="Title" class="sr-only">Name your clip</label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <VideoCameraIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <Field
            type="text"
            name="Title"
            class="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:cursor-not-allowed"
            placeholder="Clip Title"
            :disabled="uploadProgress.progress"
          />
        </div>
      </div>
      <div>
        <label for="Game" class="sr-only">Game being played</label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <PuzzlePieceIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <Field
            type="text"
            name="Game"
            class="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:cursor-not-allowed"
            placeholder="Game being played"
            :disabled="uploadProgress.progress"
          />
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center w-full" @change="fileInput">
      <label
        for="dropzone-file"
        class="flex flex-col items-center justify-center w-full h-44 border-dashed rounded-lg cursor-pointer"
        :class="[
          uploadProgress.progress
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-zinc-800 hover:bg-zinc-700',
        ]"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            aria-hidden="true"
            class="w-10 h-10 mb-3"
            :class="{
              'text-gray-400': uploadProgress.progress,
              'text-purple-700': !uploadProgress.progress,
            }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span class="font-semibold">Click to upload</span>
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            MP4 (Max: 100MB)
          </p>
        </div>
        <Field
          name="File"
          id="dropzone-file"
          type="file"
          class="hidden"
          :disabled="uploadProgress.progress"
        />
      </label>
    </div>

    <div v-if="files" class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <FilmIcon class="h-5 w-5 mt-1" />
        <span class="text-gray-500 font-semibold">{{ files.name }}</span>
      </div>
      <span>{{ convertBytesToMB(files.size) }} MB</span>
    </div>

    <button
      type="submit"
      :disabled="uploadProgress.progress"
      class="bg-purple-700 text-white px-4 py-4 rounded-md font-semibold hover:bg-purple-900 transition-all duration-150 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed disabled:text-gray-400"
    >
      Upload
    </button>
    <div>
      <ErrorMessage name="Title" class="text-red-500 text-sm" as="p" />
      <ErrorMessage name="Game" class="text-red-500 text-sm" as="p" />
      <ErrorMessage name="File" class="text-red-500 text-sm" as="p" />
    </div>
  </Form>

  <div v-if="uploadProgress.progress">
    <div class="flex justify-between mb-2">
      <span
        class="text-base font-bold"
        :class="{
          'text-white': uploadProgress.progress === 100,
          'text-purple-700': uploadProgress.progress < 100,
        }"
        >{{
          uploadProgress.progress === 100 ? "Upload Complete" : "Uploading..."
        }}</span
      >
      <span
        class="text-sm font-bold text-purple-700"
        v-if="uploadProgress.progress < 100"
        >{{ uploadProgress.progress.toFixed(0) }}%</span
      >
      <CheckCircleIcon class="h-5 w-5 text-green-500" v-else />
    </div>
    <div class="w-full bg-zinc-800 rounded-full h-2.5">
      <div
        class="h-2.5 rounded-full"
        :class="{
          'bg-purple-700': uploadProgress.progress < 100,
          'bg-green-500': uploadProgress.progress === 100,
        }"
        :style="{ width: uploadProgress.progress + '%' }"
      ></div>
    </div>
  </div>
  <div v-if="uploadProgress.errorMessage && uploadProgress.progress <= 0">
    <p class="text-red-500 text-sm">{{ uploadProgress.errorMessage }}</p>
  </div>
</template>

<script setup>
import {
  VideoCameraIcon,
  PuzzlePieceIcon,
  FilmIcon,
  CheckCircleIcon,
} from "@heroicons/vue/20/solid";
import { Form, Field, ErrorMessage } from "vee-validate";
import { uploadForm, configureVeeValidate } from "@/utils/validation";
import { ref } from "vue";
import { storage } from "@/utils/firebase";
import {
  ref as fbRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject as deleteFile,
} from "firebase/storage";
import { errorCodes, addClip } from "@/utils/firebase-helpers";
import { useUserStore } from "@/stores/user";

const emit = defineEmits(["clipAdded"]);

const userStore = useUserStore();
const uploadProgress = ref({
  progress: 0,
  errorMessage: "",
});
const files = ref(null);
configureVeeValidate();
uploadForm.definitions();

const convertBytesToMB = (bytes) => {
  const size = bytes / 1000000;
  return size.toFixed(2);
};

const fileInput = (e) => {
  files.value = e.target.files[0];
};

const submit = async (values, { resetForm }) => {
  const storageRef = fbRef(storage, `clips/${values.Title}`);
  const uploadTask = uploadBytesResumable(storageRef, values.File);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      uploadProgress.value.progress =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    },
    (error) => {
      uploadProgress.value.progress = 0;
      uploadProgress.value.errorMessage = errorCodes(error.code);
      resetForm();
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        addClip({
          title: values.Title,
          game: values.Game,
          size: `${convertBytesToMB(values.File.size)} MB`,
          url: downloadURL,
          uid: userStore.uid,
          username: userStore.username,
          avatar: userStore.avatar,
        })
          .then((data) => {
            uploadProgress.value.success = true;
            emit("clipAdded", {
              title: values.Title,
              game: values.Game,
              url: downloadURL,
              uid: userStore.uid,
              username: userStore.username,
              avatar: userStore.avatar,
              id: data.id,
              date: { seconds: Math.floor(Date.now() / 1000) },
            });
          })
          .catch((error) => {
            uploadProgress.value.errorMessage = errorCodes(error.code);
            deleteFile(storageRef);
          })
          .finally(() => {
            uploadProgress.value.progress = 0;
            resetForm();
          });
      });
    }
  );
};
</script>
