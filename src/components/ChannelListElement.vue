<template>
    <li class="channel-list-element">
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
import { X } from 'lucide-vue-next';

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
}

.channel-list-element__select {
    color: white;
    text-decoration: none;
}

.channel-list-element__delete {
    color: var(--crimson);
    text-decoration: none;
}

</style>
