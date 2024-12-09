<template>
    <div
        class="messages-container"
        ref="messages-container"
    >
        <MessageListElement
        v-for="message, key in messages"
        :key="key"
        :message="message"
        />
    </div>
</template>

<script setup lang="ts">
import type { Message } from '@/stores/messages';
import { nextTick, useTemplateRef, watch } from 'vue';
import MessageListElement from './MessageListElement.vue';

const { messages } = defineProps<{
    messages: Message[];
}>();

const messageContainer = useTemplateRef('messages-container');
watch(() => messages, () => {
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
  overflow: auto;
  justify-content: flex-end;
}

.messages-container > *:not(:first-child) {
    border-top: 1px solid color-mix(in hsl, var(--space-cadet), white 40%);
}
</style>
