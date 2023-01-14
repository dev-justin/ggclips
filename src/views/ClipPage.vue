<template>
  <main class="max-w-[2000px] mx-auto">
    <div v-if="!clip" class="flex justify-center items-center pt-12">
      <Loaders />
    </div>
    <div v-else>
      <div class="flex flex-col lg:grid grid-cols-7 gap-8">
        <VideoPlayer
          class="col-span-4 xl:col-span-5 rounded-lg overflow-clip shadow-2xl shadow-purple-700/20"
          :src="clip.url"
        />
        <div
          class="col-span-3 xl:col-span-2 flex flex-col gap-4 border-2 p-6 sm:p-8 border-zinc-700 rounded-lg"
        >
          <div
            class="flex justify-between sm:block border-b-2 pb-2 sm:pb-6 border-zinc-700/40"
          >
            <div class="flex items-center justify-between pb-4">
              <span class="text-lg text-gray-500">Creator</span>
            </div>
            <router-link
              :to="{ name: 'user', params: { id: clip.username } }"
              class="text-lg sm:text-3xl font-bold hover:text-purple-700 transition-all duration-150 ease-in-out"
            >
              <div class="inline-flex items-center gap-4">
                <img
                  class="inline-block h-6 w-6 sm:h-8 sm:w-8 rounded-full ring-2 ring-purple-700"
                  :src="clip.avatar"
                  :alt="clip.username"
                />

                {{ clip.username }}
                <span v-if="isOwner" class="text-zinc-700">(You)</span>
              </div>
            </router-link>
          </div>
          <div>
            <div class="pb-4 flex justify-between items-start">
              <div>
                <span class="text-gray-500">{{ convertDate(clip.date) }}</span>
                <h3 class="text-lg font-bold sm:text-3xl">{{ clip.title }}</h3>
              </div>
              <div
                v-if="isOwner"
                class="flex flex-row-reverse items-center gap-1 cursor-pointer group"
              >
                <PencilSquareIcon class="h-6 w-6 text-purple-700" />
                <span
                  class="text-zinc-700 font-semibold group-hover:text-purple-700"
                  >Edit</span
                >
              </div>
            </div>
            <div
              class="bg-red-200 inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase text-red-900"
            >
              <span>{{ clip.game }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { getClip, convertDate } from "@/utils/firebase-helpers";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { PencilSquareIcon } from "@heroicons/vue/20/solid";
import VideoPlayer from "@/components/VideoPlayer.vue";
import Loaders from "@/components/common/Loaders.vue";

const user = useUserStore();
const route = useRoute();
const router = useRouter();

// States
const clip = ref(null);
const isOwner = ref(false);
const editMode = ref(false);

// Get route params
const { id } = route.params;

// Fetch clip based on route id param
getClip(id)
  .then((data) => {
    data ? (clip.value = data) : router.push("/");
    console.log(clip.value);
  })
  .finally(() => {
    isOwner.value = user.uid === clip.value.uid;
  });
</script>
