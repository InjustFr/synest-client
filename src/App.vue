<template>
  <aside>
    <ChannelList
      :channels="channelNames"
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
import MessageList from './components/MessageList.vue'
import ChannelList from './components/ChannelList.vue';
import { computed, ref } from 'vue';
import { Channel, useMessagesStore } from './stores/messages';
import { storeToRefs } from 'pinia'

const URL = 'ws://localhost:8080';

const { channels } = storeToRefs(useMessagesStore());

const channelNames = computed(() => {
  return channels.value.map(channel => channel.name);
});

const message = ref('');
const username = ref('');
const socketOpened = ref(false);
const selectedChannel = ref<Channel>(channels.value[0] ?? null);

let websocket: WebSocket | null = null;

function onSocketOpen(event: Event) {
    socketOpened.value = true;
}

function onSocketClose(event: Event) {
    socketOpened.value = false;
}

function onSocketMessage(event: MessageEvent) {
    const recievedMessage = JSON.parse(event.data);

    const channel = channels.value.find((channel) => channel.name === recievedMessage.channel);

    channel?.messages.push(recievedMessage);
}

function onSocketError(event: Event) {
    console.error('Error with websocket');
}

function sendMessage() {
    if(!message.value || !websocket) {
        return;
    }

    const messageToSend = { username: username.value, message: message.value, channel: selectedChannel.value.name };

    websocket.send(JSON.stringify(messageToSend));

    message.value = '';
}

function connect() {
    websocket = new WebSocket(URL);

    websocket.onopen = onSocketOpen;
    websocket.onclose = onSocketClose;
    websocket.onmessage = onSocketMessage;
    websocket.onerror = onSocketError;
}

function selectChannel(name: string) {
  selectedChannel.value = channels.value.find((channel) => channel.name === name) ?? null;
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
