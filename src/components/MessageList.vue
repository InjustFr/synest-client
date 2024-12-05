<template>
  <div
      class="messages-container"
      ref="messages-container"
  >
    <p
      v-for="message, key in messages"
      :key="key"
      class="message"
    >
      {{ message.username }} : {{ message.content }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@/stores/messages';
import { nextTick, useTemplateRef, watch } from 'vue';

const { messages } = defineProps<{
    messages: Message[];
}>();

const messageContainer = useTemplateRef('messages-container');
watch(() => messages, () => {
    console.error(messageContainer.value?.scrollHeight);
    nextTick(() => {
        messageContainer.value?.scrollTo({
            top: messageContainer.value?.scrollHeight,
            behavior: 'smooth',
        });
    });
}, { deep: true });
</script>

<style scoped>
.messages-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
}

.messages-container > p {
    border: 1px solid black;
    padding: 1rem;
}
</style>
