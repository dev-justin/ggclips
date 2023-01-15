<template>
  <BasicTextBanner
    headline="Following"
    subline="Your friends clips will be shown here."
    background="https://images.pexels.com/photos/7130475/pexels-photo-7130475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  />
  <main>
    <Loaders v-if="loading" />
    <template v-else>
      <h3 v-if="!followingList">Follow people to see them appear below.</h3>
      <div v-else class="flex gap-8 flex-wrap">
        <VideoCard
          class="w-[360px]"
          v-for="clip in followingClips"
          :key="clip.date.seconds"
          :src="clip.url"
          :game="clip.game"
          :username="clip.username"
          :id="clip.id"
          :avatar="clip.avatar"
          :date="convertDate(clip.date)"
          :title="clip.title"
        />
      </div>
    </template>
  </main>
</template>

<script setup>
import { ref } from "vue";
import BasicTextBanner from "@/components/BasicTextBanner.vue";
import { useUserStore } from "@/stores/user";
import {
  getUserDetails,
  getFollowingClips,
  convertDate,
} from "@/utils/firebase-helpers";
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
