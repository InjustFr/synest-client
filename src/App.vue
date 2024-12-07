<template>
    <aside>
        <ChannelList
        :channels="channels"
        @select="selectChannel($event)"
        ></ChannelList>
    </aside>
    <main>
        <div class="channel">
        <h1>Channel {{ selectedChannel?.name }}</h1>
        <MessageList :messages="selectedChannel?.messages ?? []" />
        <form @submit.prevent="sendMessage" class="message-form">
            <label for="username">Username</label>
            <input v-model="username" id="username" />
            <button type="button" @click.prevent="connect">Connect</button>
            <label for="message">Message</label>
            <textarea v-model="message" id="message" rows="5"></textarea>
            <button type="submit">Send</button>
        </form>
        </div>
    </main>
</template>

<script setup lang="ts">
import MessageList from './components/MessageList.vue';
import ChannelList from './components/ChannelList.vue';
import { ref } from 'vue';
import { type Channel, type Message, useMessagesStore } from './stores/messages';
import { storeToRefs } from 'pinia';

const URL = '/api/.well-known/mercure?topic=/server';

const { channels } = storeToRefs(useMessagesStore());

const message = ref('');
const username = ref('');
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
        username: username.value,
        content: message.value,
        channel: selectedChannel.value.id,
    };

    await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify(messageToSend),
        headers: {
            'Content-Type': 'application/json',
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
    const response = await fetch('/api/channels');
    if (!response.ok) {
        throw new Error('Error while fetching channels');
    }

    channels.value = await response.json();

    selectedChannel.value = channels.value[0] ?? null;
}
</script>

<style>
* {
box-sizing: border-box;
}

body {
  padding: 0;
  margin: 0;
}

#app {
  display: flex;
}

#app > aside {
  width: 15%;
  padding: 1rem;
  border-right: 1px solid black;
}
#app > main {
  flex-grow: 1;
}

.channel {
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.message-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-self: flex-start;
}

.message-form input, .message-form textarea {
  min-width: 200px;
}
</style>
