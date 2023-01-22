<template>
  <BasicTextBanner
    headline="Following"
    subline="Your friends clips will be shown here."
    background="https://images.pexels.com/photos/7130475/pexels-photo-7130475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  />
  <main class="min-h-[calc(100vh-472px)]">
    <div
      v-if="loading"
      class="flex justify-center items-center pt-12 flex-col gap-8"
    >
      <Loaders />
      <span class="text-zinc-500">Loading following...</span>
    </div>
    <template v-else>
      <h3 v-if="!followingList">Follow people to see them appear below.</h3>
      <h3 v-else-if="!followingClips.length">
        Once your following have uploaded a clip it will show here.
      </h3>
      <div v-else class="flex gap-8 flex-wrap">
        <VideoCard
          class="w-[360px]"
          v-for="clip in followingClips"
          :key="clip.id"
          :clip="clip"
        />
      </div>
    </template>
  </main>
</template>

<script setup>
import { ref } from "vue";
import BasicTextBanner from "@/components/BasicTextBanner.vue";
import { useUserStore } from "@/stores/user";
import { getUserDetails, getFollowingClips } from "@/utils/firebase-helpers";
import VideoCard from "@/components/VideoCard.vue";
import Loaders from "@/components/common/Loaders.vue";

const userStore = useUserStore();
const followingList = ref(false);
const followingClips = ref([]);
const loading = ref(true);

getUserDetails(userStore.username)
  .then((user) => {
    followingList.value = user.following.length || false;
    if (followingList.value) {
      getFollowingClips(user.following).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          followingClips.value.push({ id: doc.id, ...doc.data() });
        });
      });
    }
  })
  .finally(() => {
    loading.value = false;
  });
</script>
