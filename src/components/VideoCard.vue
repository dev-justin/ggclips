<template>
  <div class="flex flex-col">
    <div class="pb-2 flex flex-col">
      <span class="text-sm text-gray-500">{{ date }}</span>
      <router-link
        :to="{ name: 'clip', params: { id } }"
        class="text-purple-700 font-bold text-lg inline-flex items-center gap-2 group"
      >
        <span> {{ title }}</span>
        <EyeIcon
          class="h-4 w-4 text-white group-hover:text-purple-400 group-hover:scale-110 transition-all duration-300 ease-in-out group-hover:animate-pulse"
        />
      </router-link>
    </div>

    <video
      id="mux-default"
      class="video-js vjs-16-9"
      controls
      preload="auto"
      width="100%"
    ></video>

    <div class="flex items-center justify-between pt-4">
      <div
        class="bg-red-200 inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase text-red-900"
      >
        <span>{{ game }}</span>
      </div>
      <router-link :to="{ name: 'user', params: { id: username } }">
        <div class="flex items-center gap-2 group">
          <img
            class="inline-block h-6 w-6 rounded-full ring-2 ring-white group-hover:ring-purple-700 transition-all duration-150 ease-in-out"
            :src="avatar"
            :alt="username"
          />
          <span
            class="text-white group-hover:text-purple-700 transition-all duration-150 ease-in-out"
            >{{ username }}</span
          >
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { EyeIcon } from "@heroicons/vue/20/solid";
import videojs from "@mux/videojs-kit";
import "@mux/videojs-kit/dist/index.css";

onMounted(() => {
  const player = videojs("mux-default", {
    playbackRates: [0.25, 0.5, 1, 1.5],
    loop: true,
  });

  player.src({
    src: "6e02b7902hoKsThOc7hQ3unVG1k1ycR75YF71laqJJWjI",
    type: "video/mux",
  });
});

const props = defineProps({
  playback: {
    type: String,
    required: true,
  },
  game: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});
</script>
