<template>
    <div class="video-channel-participant">
        <video
            class="video-channel-participant__video"
            ref="video-player"
            autoplay
            :muted="muted"
            :style="style"
        ></video>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, useTemplateRef, type Ref } from 'vue';

const { stream, muted = false, inversed = false } = defineProps<{
    stream: MediaStream;
    muted?: boolean;
    inversed?: boolean;
}>();

const videoPlayer = useTemplateRef('video-player');

onMounted(() => {
    if (videoPlayer.value) {
        videoPlayer.value.srcObject = stream;
    }
});

const style = computed(() => {
    if (inversed) {
        return {
            transform: 'rotateY(180deg)',
        };
    }

    return {};
});
</script>

<style lang="css" scoped>
.video-channel-participant {
    aspect-ratio: 16 / 9;
}
.video-channel-participant__video {
    max-width: 700px;
    width: 100%;
}
</style>
