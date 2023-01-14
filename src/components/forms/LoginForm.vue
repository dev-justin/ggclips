<template>
  <Modal dialogTitle="Login">
    <div
      class="flex items-center gap-1 text-purple-700 justify-center"
      v-if="successMessage"
    >
      <CheckCircleIcon class="h-5 w-5" aria-hidden="true" />
      <p>{{ successMessage }}</p>
    </div>
    <div v-else>
      <div class="flex items-center justify-center" v-if="submitting">
        <div role="status">
          <svg
            aria-hidden="true"
            class="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-purple-700"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
        Loging you in...
      </div>
      <Form
        v-else
        @submit="submit"
        :validation-schema="loginForm.schema"
        class="flex flex-col gap-2"
      >
        <div
          v-if="errorMessage"
          class="text-red-500 flex items-center justify-center gap-1"
        >
          <ExclamationCircleIcon class="h-5 w-5 mt-1" />
          <p class="leading-none text-base">{{ errorMessage }}</p>
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <div class="relative mt-1 rounded-md shadow-sm">
            <div
              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
            >
              <EnvelopeIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <Field
              type="email"
              name="email"
              id="email"
              class="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <div class="relative mt-1 rounded-md shadow-sm">
            <div
              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
            >
              <KeyIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <Field
              type="password"
              name="password"
              id="password"
              class="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="password"
            />
          </div>
        </div>
        <button
          type="submit"
          class="bg-purple-700 rounded-md p-2 hover:bg-purple-800 transition-all duration-150 ease-in-out mt-4 text-white"
        >
          Login
        </button>
        <div>
          <ErrorMessage name="email" class="text-red-500 text-sm" as="p" />
          <ErrorMessage name="password" class="text-red-500 text-sm" as="p" />
        </div>
      </Form>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import Modal from "@/components/global/Modal.vue";
import {
  EnvelopeIcon,
  KeyIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/vue/20/solid";
import { Form, Field, ErrorMessage } from "vee-validate";
import { loginForm, configureVeeValidate } from "@/utils/validation";
import { useUserStore } from "@/stores/user";
import { useModalStore } from "@/stores/modal";
import { errorCodes } from "@/utils/firebase-helpers";

let submitting = ref(false);
let errorMessage = ref("");
let successMessage = ref("");
const userStore = useUserStore();
const modalStore = useModalStore();

configureVeeValidate();
loginForm.definitions();

// Handle form submission
const submit = async (values) => {
  submitting.value = true;
  try {
    await userStore.login(values);
    successMessage.value = "Login successful";
    setTimeout(() => {
      if (modalStore.isModalOpen) {
        modalStore.toggleModal();
      }
    }, 1000);
  } catch (error) {
    errorMessage.value = errorCodes(error.code);
  } finally {
    submitting.value = false;
  }
};
</script>
