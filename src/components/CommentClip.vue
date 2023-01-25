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
import { getToken } from "@/utils/firebase-helpers";

const toast = useToast();

const props = defineProps({
  clipId: {
    type: String,
    required: true,
  },
});

configureVeeValidate();
commentForm.definitions();

const handleComment = async (values) => {
  try {
    const authToken = await getToken();
    if (!authToken) throw new Error({ message: "No auth token" });

    const data = await fetch("http://127.0.0.1:3005/api/comment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clipId: props.clipId,
        comment: values.Comment,
      }),
    });

    if (!data.ok) throw new Error({ message: "Something went wrong" });

    toast.success("Comment added");
  } catch (error) {
    switch (error.message) {
      case "No auth token":
        toast.error("You need to be logged in to comment");
        break;
      default:
        toast.error("Something went wrong");
        break;
    }
  }
};
</script>