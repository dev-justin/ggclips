<template>
  <ProfileBanner
    v-if="!loading"
    :username="profile.username"
    :avatar="profile.photoURL"
    backgroundImage="https://images.pexels.com/photos/6984984/pexels-photo-6984984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  />
  <main>
    <!-- Users Clips -->
    <Loaders v-if="loading" />
    <div v-else>
      <div v-if="isOwner">
        <p class="text-lg text-zinc-500">
          This is how you appear to the public.
        </p>
      </div>
      <h1 class="text-3xl font-bold pb-6 pt-8">Clips</h1>
      <div>
        <p class="text-xl font-bold text-zinc-500" v-if="clips.length === 0">
          {{ id }} has no clips yet.
        </p>
        <div class="flex gap-8 flex-wrap">
          <div v-for="clip in clips" class="w-[370px]">
            <VideoCard
              :title="clip.title"
              :src="clip.url"
              :game="clip.game"
              :username="clip.username"
              :avatar="clip.avatar"
              :date="convertDate(clip.date)"
              :id="clip.id"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import ProfileBanner from "@/components/ProfileBanner.vue";
import VideoCard from "@/components/VideoCard.vue";
import Loaders from "@/components/common/Loaders.vue";
import { useRoute, useRouter } from "vue-router";
import {
  convertDate,
  getClipsByUsername,
  getUserDetails,
} from "@/utils/firebase-helpers";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const route = useRoute();
const router = useRouter();
const user = useUserStore();

// Get route params
const { id } = route.params;

const loading = ref(true);
const clips = ref([]);
const profile = ref(null);
const isOwner = ref(false);

getUserDetails(id).then((data) => {
  !data.uid ? router.push({ name: "home" }) : getClips();
  profile.value = data;
  isOwner.value = user.uid === data.uid;
});

const getClips = () => {
  getClipsByUsername(id)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        clips.value.push({ id: doc.id, ...doc.data() });
      });
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
