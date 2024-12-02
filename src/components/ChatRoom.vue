<template>
    <div class="chat">
        <h1>ChatRoom</h1>
        <div
            class="messages-container"
        >
            <p
                v-for="message, key in messages"
                :key="key"
                class="message"
            >
                {{ message.username }} : {{ message.message }}
            </p>
        </div>
        <form @submit.prevent="sendMessage" class="message-form">
            <label for="username">Username</label>
            <input v-model="username" id="username" />
            <button type="button" @click.prevent="connect">Connect</button>
            <label for="message">Message</label>
            <textarea v-model="message" id="message" rows="5"></textarea>
            <button type="submit">Send</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

type Message = {
    username: string;
    message: string;
}

const URL = 'ws://localhost:8080';

const messages = ref<Message[]>([]);

const message = ref('');
const username = ref('');
const socketOpened = ref(false);

let websocket: WebSocket | null = null;

function onSocketOpen(event: Event) {
    socketOpened.value = true;
}

function onSocketClose(event: Event) {
    socketOpened.value = false;
}

function onSocketMessage(event: MessageEvent) {
    const recievedMessage = JSON.parse(event.data);

    messages.value.push(recievedMessage);
}

function onSocketError(event: Event) {
    console.error('Error with websocket');
}

function sendMessage() {
    if(!message.value || !websocket) {
        return;
    }

    const messageToSend = { username: username.value, message: message.value };

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

</script>

<style scoped>
.chat {
    height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem
}

.messages-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem
}

.messages-container > p {
    border: 1px solid black;
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