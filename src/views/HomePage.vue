<template>
  <Banner />
  <main>
    <!-- Slider with featured videos -->
    <div>
      <h1 class="text-3xl font-bold pb-6">Recent Clips</h1>
      <Loaders v-if="loading" />
      <div v-else>
        <p class="text-xl font-bold text-zinc-500" v-if="clips.length === 0">
          No clips to show, please try again later.
        </p>
        <div class="flex gap-8 flex-wrap">
          <VideoCard
            v-for="clip in clips"
            class="w-[370px]"
            :key="clip.id"
            :clip="clip"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import Banner from "@/components/Banner.vue";
import VideoCard from "@/components/VideoCard.vue";
import { getRecentClips, convertDate } from "@/utils/firebase-helpers";
import Loaders from "@/components/common/Loaders.vue";
import { ref } from "vue";

const loading = ref(true);
const clips = ref([]);

getRecentClips()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      clips.value.push({ id: doc.id, ...doc.data() });
    });
  })
  .catch((error) => {
    console.log("Error getting documents: ", error);
  })
  .finally(() => {
    loading.value = false;
  });
</script>
