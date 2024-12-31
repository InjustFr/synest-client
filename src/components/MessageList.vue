<template>
    <div class="message-list">
        <div
            class="message-list__container"
        >
            <MessageListElement
            v-for="message, key in messages"
            :key="key"
            :message="message"
            />
        </div>

    </div>
</template>

<script setup lang="ts">
import type { Message } from '@/types/channel';
import MessageListElement from './MessageListElement.vue';

const { messages } = defineProps<{
    messages: Message[];
}>();
</script>

<style scoped>
.message-list {
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
}

.message-list__container > *:not(:first-child) {
    border-top: 1px solid var(--background);
}
</style>
