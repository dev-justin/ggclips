<template>
  <VideoPlayer
    class="vjs-theme-forest cc-theme"
    :src="`https://stream.mux.com/LHVWqnnwrnvQgR7GVmTl00BtBB7aG6BZUuCLnIMgNFBg.m3u8`"
    fluid
    controls
    :playbackRates="[0.5, 1, 1.5]"
    :volume="0.25"
  />
</template>

<script setup>
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";
import "@videojs/themes/dist/forest/index.css";
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
});
</script>
