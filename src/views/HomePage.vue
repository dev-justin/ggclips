<template>
  <Banner />
  <main>
    <!-- Slider with featured videos -->
    <div>
      <h1 class="text-3xl font-bold pb-6">Recent Clips</h1>
      <div class="flex gap-8 flex-wrap" v-if="loading">
        <VideoCardLoad v-for="n in 4" />
      </div>

      <div v-else>
        <p class="text-xl font-bold text-zinc-500" v-if="clips.length === 0">
          No clips to show, please try again later.
        </p>
        <div class="flex gap-8 flex-wrap">
          <VideoCard
            v-for="clip in clips"
            class="w-[370px]"
            :key="clip.video.id"
            :clip="clip.video"
            :likesArray="clip.likesArray"
            :currentUser="userStore.username"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import Banner from "@/components/Banner.vue";
import VideoCard from "@/components/VideoCard.vue";
import { getRecentClips } from "@/utils/firebase-helpers";
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import VideoCardLoad from "../components/VideoCardLoad.vue";

const userStore = useUserStore();
const loading = ref(true);
const clips = ref([]);

getRecentClips()
  .then((data) => {
    clips.value = data;
  })
  .catch((error) => {
    console.log("Error getting documents: ", error);
  })
  .finally(() => {
    loading.value = false;
  });
</script>
