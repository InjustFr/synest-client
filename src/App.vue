<template>
    <div class="app-container">
        <aside>
            <ChannelList
            :channels="channels"
            @select="selectChannel($event)"
            ></ChannelList>
        </aside>
        <main class="channel">
            <h1>Channel {{ selectedChannel?.name }}</h1>
            <MessageList v-if="selectedChannel?.type === 'text'" :messages="selectedChannel?.messages ?? []" />
            <VideoChannel v-if="selectedChannel?.type === 'video'" :channel="selectedChannel" />
            <form @submit.prevent="sendMessage" class="message-form">
                <AppTextarea v-model="message" id="message" placeholder="Type your message ..." />
                <AppButton type="submit" icon><SendHorizonal /></AppButton>
            </form>
        </main>
        <ProfileView />
        <LoginPopin
            v-if="!isLoggedIn"
            @logged-in="connect"
        />
    </div>
</template>

<script setup lang="ts">
import MessageList from './components/MessageList.vue';
import ChannelList from './components/ChannelList.vue';
import { ref } from 'vue';
import { useMessagesStore } from './stores/messages';
import { storeToRefs } from 'pinia';
import AppButton from './components/AppButton.vue';
import AppTextarea from './components/AppTextarea.vue';
import LoginPopin from './components/Login/LoginPopin.vue';
import { useUserStore } from './stores/user';
import { SendHorizonal } from 'lucide-vue-next';
import type { Channel, Message } from './types/channel';
import { getChannels } from './api/channel';
import ProfileView from './components/ProfileView.vue';
import VideoChannel from './components/VideoChannel.vue';

const URL = '/api/.well-known/mercure?topic=/server';

const { channels } = storeToRefs(useMessagesStore());

const { profile, token, isLoggedIn } = storeToRefs(useUserStore());

const message = ref('');
const eventSourceOpened = ref(false);
const selectedChannel = ref<Channel>(channels.value[0] ?? null);

let eventSource: EventSource | null = null;

function onEventSourceOpen(event: Event) {
    eventSourceOpened.value = true;
}

function onEventSourceMessage(event: MessageEvent) {
    const recievedMessage = JSON.parse(event.data);
    console.log(recievedMessage);

    switch (recievedMessage.type) {
        case 'message_created':
            const channel = channels.value.find(channel => channel.id === recievedMessage.data.channel);

            const newMessage = {
                id: recievedMessage.data.id,
                content: recievedMessage.data.content,
                username: recievedMessage.data.username,
            } as Message;

            channel?.messages.push(newMessage);
            break;
        case 'channel_created':
            channels.value.push({ ...recievedMessage.data, messages: [] });
            break;
        case 'channel_deleted':
            const channelIndex = channels.value.findIndex(channel => channel.id === recievedMessage.data.id);
            if (channelIndex !== -1) {
                channels.value.splice(channelIndex, 1);
            }

            if (recievedMessage.data.id === selectedChannel.value.id) {
                selectedChannel.value = channels.value[0] ?? null;
            }

            break;
    }
}

function onEventSourceError(event: Event) {
    console.error('Error with eventSource', event);
}

async function sendMessage() {
    if (!message.value) {
        return;
    }

    const messageToSend = {
        username: profile.value?.username,
        content: message.value,
        channel: selectedChannel.value.id,
    };

    await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify(messageToSend),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token.value,
        },
    });

    message.value = '';
}

async function connect() {
    await loadChannels();

    eventSource = new EventSource(URL);

    eventSource.onopen = onEventSourceOpen;
    eventSource.onmessage = onEventSourceMessage;
    eventSource.onerror = onEventSourceError;
}

function selectChannel(channel: Channel) {
    selectedChannel.value = channel;
}

async function loadChannels() {
    channels.value = await getChannels();
    selectedChannel.value = channels.value[0] ?? null;
}
</script>

<style>
@import './main.css';
</style>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}

.app-container > aside {
  width: 15%;
  padding: 1rem;
  color: white;
  background: var(--space-cadet);
}

.channel {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem ;
  flex-grow: 1;
  background: color-mix(in hsl, var(--space-cadet), white 5%);
  color: white;
}

.message-form {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0 1rem;
  width: 100%
}

.message-form .textarea {
  min-width: 200px;
  flex-grow: 1;
}
</style>
