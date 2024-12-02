<template>
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
</template>

<script setup lang="ts">
import type { Message } from '@/stores/messages';

const { messages } = defineProps<{
  messages: Message[];
}>();
</script>

<style scoped>
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
</style>