<template>
    <div class="app-container">
        <aside>
            <ServerList
                v-model="selectedServer"
                @update:model-value="loadChannels()"
                @server-created="onServerCreated()"
                @server-removed="onServerRemoved()"
            />
        </aside>
        <aside v-if="selectedServer">
            <ChannelList
            :channels="channels"
            :server="selectedServer"
            @select="selectChannel($event)"
            ></ChannelList>
        </aside>
        <main class="channel">
            <h2>Channel {{ selectedChannel?.name }}</h2>
            <MessageList v-if="selectedChannel?.type === 'text'" :messages="selectedChannel?.messages ?? []" />
            <VideoChannel v-if="selectedChannel?.type === 'video'" :channel="selectedChannel" />
            <form @submit.prevent="sendMessage" class="message-form">
                <AppTextarea v-model="message" id="message" placeholder="Type your message ..." />
                <AppButton type="submit" icon><SendHorizonal /></AppButton>
            </form>
        </main>
        <ProfileView />
        <LoginPopin
            v-model="showLoginPopin"
            @logged-in="connect"
        />
        <div id="modals"></div>
    </div>
</template>

<script setup lang="ts">
import { MessageList } from '@/pages/channel-id';
import { ChannelList } from '@/pages/server-id';
import { ref } from 'vue';
import { useChannelsStore } from '@/entities/channel';
import { storeToRefs } from 'pinia';
import { AppButton, AppTextarea } from '@/shared/ui';
import { LoginPopin } from '@/pages/login';
import { useUserStore, getServers } from '@/entities/user';
import { SendHorizonal } from 'lucide-vue-next';
import type { Channel, Message } from '../entities/channel/model/channel';
import { getChannels } from '../entities/channel';
import { ProfileView } from '@/widgets/profile';
import { VideoChannel } from '@/pages/video-channel-id';
import { useServerStore } from '@/entities/server';
import { ServerList } from '@/widgets/server-list';
import type { Server } from '../entities/server/model/server';
import { useEventSource } from '@/shared/lib';
import { createMessage, getMessages } from '@/entities/message';

const { channels } = storeToRefs(useChannelsStore());
const { servers } = storeToRefs(useServerStore());

const { profile, token, isLoggedIn } = storeToRefs(useUserStore());

const message = ref('');
const selectedChannel = ref<Channel>(channels.value[0] ?? null);
const selectedServer = ref<Server | null>(null);
const showLoginPopin = ref<boolean>(!isLoggedIn.value);

const { init: initEventSource, addHandler } = useEventSource();

addHandler('message_created', (message: unknown) => {
    const data = message as {
        id: string;
        content: string;
        username: string;
        channel: string;
    };

    const channel = channels.value.find(channel => channel.id === data.channel);

    const newMessage = {
        id: data.id,
        content: data.content,
        username: data.username,
    } as Message;

    channel?.messages.push(newMessage);
});

addHandler('channel_created', (message: unknown) => {
    const data = message as Omit<Channel, 'messages'>;

    channels.value.push({ ...data, messages: [] as Message[] });
});

addHandler('channel_deleted', (message: unknown) => {
    const data = message as { id: string };
    const channelIndex = channels.value.findIndex(channel => channel.id === data.id);
    if (channelIndex !== -1) {
        channels.value.splice(channelIndex, 1);
    }

    if (data.id === selectedChannel.value.id) {
        selectedChannel.value = channels.value[0] ?? null;
    }
});

async function sendMessage() {
    if (!message.value) {
        return;
    }

    const messageToSend = {
        content: message.value,
    };

    await createMessage(messageToSend, selectedServer.value.id, selectedChannel.value.id);

    message.value = '';
}

async function connect() {
    await loadServers();

    await loadChannels();
}

async function selectChannel(channel: Channel) {
    selectedChannel.value = channel;
    selectedChannel.value.messages = await getMessages(selectedServer.value.id, selectedChannel.value.id);
}

async function loadChannels() {
    if (!selectedServer.value) {
        return;
    }

    channels.value = await getChannels(selectedServer.value.id);
    const channel = channels.value[0] ?? null;
    if (channel) {
        await selectChannel(channel);
    }
}

async function loadServers() {
    const { servers: apiServers, hubUrl } = await getServers();

    servers.value = apiServers;
    selectedServer.value = servers.value[0];

    if (hubUrl) {
        const hub = new URL(hubUrl);
        servers.value.forEach((server) => {
            hub.searchParams.append('topic', '/server/' + server.id);
        });

        initEventSource(hub);
    }
}

async function onServerCreated() {
    await loadServers();

    selectedServer.value = servers.value[servers.value.length - 1];
    loadChannels();
}

async function onServerRemoved() {
    console.error('triggered');
    await loadServers();

    selectedServer.value = servers.value[0];
    loadChannels();
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

.channel {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem ;
  flex-grow: 1;
  color: var(--white);
}

.channel > .message-list {
    flex-grow: 1;
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
