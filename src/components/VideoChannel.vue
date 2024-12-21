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
import { onMounted, ref } from 'vue';
import VideoChannelParticipant from './VideoChannelParticipant.vue';

const { channel } = defineProps<{
    channel: Channel;
}>();

const localStream = ref<MediaStream | null>(null);
const remoteStreams = ref<MediaStream[]>([]);

function guidGenerator() {
    const S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
}

onMounted(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
            const pc = new RTCPeerConnection();
            console.log(pc);
            const id = guidGenerator();
            const roomId = channel.id;
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
            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            const ws = new WebSocket('ws://localhost:8080/');
            ws.onopen = function (evt) {
                ws.send(JSON.stringify({
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

                console.log('onicetriggered', pc);

                ws.send(JSON.stringify({
                    type: 'candidate', data: {
                        peerId: id,
                        roomId,
                        candidate: JSON.stringify(e.candidate),
                    },
                }));
            };

            ws.onclose = function (evt) {
                window.alert('Websocket has closed');
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
                        pc.setRemoteDescription(offer);
                        console.log('offer triggered', pc);
                        pc.createAnswer().then((answer) => {
                            pc.setLocalDescription(answer);
                            ws.send(JSON.stringify({
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
                        console.log(candidate);
                        if (!candidate) {
                            return console.log('failed to parse candidate');
                        }

                        pc.addIceCandidate(candidate);
                        console.log('candidate triggered', pc);
                }
            };

            ws.onerror = function (evt) {
                console.log('ERROR: ' + evt.data);
            };
        }).catch(console.error);
});

</script>

<style lang="css" scoped>
.video-channel {
    display: flex;
}
</style>
