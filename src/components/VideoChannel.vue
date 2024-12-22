<template>
    <div class="video-channel">
        <VideoChannelParticipant
            v-if="localStream"
            :stream="localStream"
            inversed
            muted
        />
        <VideoChannelParticipant
            v-for="stream, k in remoteStreams"
            :key="k"
            :stream="stream"
        />
    </div>
</template>

<script setup lang="ts">
import type { Channel } from '@/types/channel';
import { onMounted, onUnmounted, ref } from 'vue';
import VideoChannelParticipant from './VideoChannelParticipant.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const { channel } = defineProps<{
    channel: Channel;
}>();

const { profile } = storeToRefs(useUserStore());

const localStream = ref<MediaStream | null>(null);
const remoteStreams = ref<MediaStream[]>([]);

let ws: WebSocket | null = null;
let pc: RTCPeerConnection | null;
const id = profile.value?.username;
const roomId = channel.id;

onMounted(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 776, ideal: 720, max: 1080 },
    }, audio: true });

    pc = new RTCPeerConnection();
    pc.ontrack = function (event) {
        if (event.track.kind === 'audio') {
            return;
        }

        remoteStreams.value.push(event.streams[0]);

        event.streams[0].onremovetrack = ({ track }) => {
            const index = remoteStreams.value.findIndex(t => t === event.streams[0]);
            if (index !== -1) {
                remoteStreams.value.splice(index, 1);
            }
        };
    };

    localStream.value = stream;
    stream.getTracks().forEach(track => pc?.addTrack(track, stream));

    ws = new WebSocket('ws://localhost:8080/');
    ws.onopen = function (evt) {
        ws?.send(JSON.stringify({
            data: {
                roomId,
                peerId: id,
            },
            type: 'join',
        }));
    };

    pc.onicecandidate = (e) => {
        if (!e.candidate) {
            return;
        }

        ws?.send(JSON.stringify({
            type: 'candidate', data: {
                peerId: id,
                roomId,
                candidate: JSON.stringify(e.candidate),
            },
        }));
    };

    ws.onmessage = function (evt) {
        const msg = JSON.parse(evt.data);
        if (!msg) {
            return console.log('failed to parse msg');
        }

        switch (msg.type) {
            case 'offer':
                const offer = JSON.parse(msg.data);
                if (!offer) {
                    return console.log('failed to parse answer');
                }

                pc?.setRemoteDescription(offer);
                pc?.createAnswer().then((answer) => {
                    pc?.setLocalDescription(answer);
                    ws?.send(JSON.stringify({
                        type: 'answer', data: {
                            peerId: id,
                            roomId,
                            answer: JSON.stringify(answer),
                        },
                    }));
                });

                return;
            case 'candidate':
                const candidate = JSON.parse(msg.data);
                if (!candidate) {
                    return console.log('failed to parse candidate');
                }

                pc?.addIceCandidate(candidate);
        }
    };

    ws.onerror = function (evt) {
        console.log('ERROR: ' + evt);
    };
});

onUnmounted(() => {
    if (ws) {
        ws.send(JSON.stringify({
            data: {
                roomId,
                peerId: id,
            },
            type: 'leave',
        }));
        ws.close();
        localStream.value?.getTracks().forEach((track) => {
            if (track.readyState == 'live') {
                track.stop();
            }
        });
        localStream.value = null;
    }
    if (pc) {
        pc.close();
    }
});

</script>

<style lang="css" scoped>
.video-channel {
    display: grid;
    grid-auto-columns: minmax(100px, auto);
    grid-auto-rows: minmax(100px, auto);
    gap: 1rem;
    grid-auto-flow: column;
    justify-content: center;
    flex-grow: 1;
}
</style>
