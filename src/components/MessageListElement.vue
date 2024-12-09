<template>
    <div class="channel-message">
        <p class="channel-message__title"><strong>{{ message.username }}</strong></p>
        <p>{{ message.content }}</p>
    </div>
</template>

<script setup lang="ts">
import type { Message } from '@/stores/messages';

defineProps<{
    message: Message;
}>();
</script>

<style scoped>
.channel-message {
    padding: 1.75rem 1rem;
}

.channel-message__title {
    font-size: 1.15rem;
    margin-bottom: 0.25rem;
}
</style>
