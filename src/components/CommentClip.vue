<template>
  <div>
    <Form @submit="handleComment" :validation-schema="commentForm.schema">
      <div class="pt-4">
        <ErrorMessage name="Comment" class="text-red-500 text-sm" as="p" />
      </div>
      <div>
        <div>
          <label for="Comment" class="sr-only">Name your clip</label>
          <Field
            type="text"
            name="Comment"
            id="Comment"
            class="flex w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none focus:ring-0 focus:border-zinc-700 border-t-0 border-x-0 mb-4 px-0 border-zinc-700"
            placeholder="Write a comment..."
          />
        </div>
        <button
          type="submit"
          class="bg-zinc-700 px-4 py-2 rounded-full text-sm hover:bg-purple-700 transition-all duration-150 ease-out"
        >
          Comment
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import { commentForm, configureVeeValidate } from "@/utils/validation";
import { useToast } from "vue-toastification";

const toast = useToast();

const props = defineProps({
  clipId: {
    type: String,
    required: true,
  },
});

configureVeeValidate();
commentForm.definitions();

const handleComment = (values) => {
  console.log(values);
  toast.info("Comments are coming soon!");
};
</script>
