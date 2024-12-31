<template>
    <li class="channel-list-element">
        <Video v-if="channel.type === 'video'" />
        <MessageSquare v-else />
        <a
            class="channel-list-element__select"
            href=""
            @click.prevent="emit('select', channel)"
        >
            {{ channel.name }}
        </a>
        <a
            class="channel-list-element__delete"
            href=""
            @click.prevent="emit('delete', channel)"
        >
            <X />
        </a>
    </li>
</template>

<script setup lang="ts">
import type { Channel } from '@/types/channel';
import { MessageSquare, Video, X } from 'lucide-vue-next';

defineProps<{
    channel: Channel;
}>();

const emit = defineEmits<{
    select: [Channel];
    delete: [Channel];
}>();
</script>

<style scoped>
.channel-list-element {
    list-style: none;
    padding: 0.25rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.channel-list-element__select {
    color: var(--white);
    text-decoration: none;
    margin-left: 0.5rem;
}

.channel-list-element__delete {
    color: var(--danger);
    text-decoration: none;
    margin-left: auto;
}

</style>
