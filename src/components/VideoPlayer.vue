<template>
  <VueVideoPlayer
    :src="src + '.mp4'"
    class="vjs-theme-forest cc-theme"
    controls
    :fluid="true"
    :volume="0.25"
    :playbackRates="[0.25, 0.5, 1, 1.5]"
    :loop="true"
  />
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
});
</script>
