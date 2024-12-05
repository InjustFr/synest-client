<template>
    <ul>
        <li
            v-for="channel, key in channels"
            :key="key"
        >
            <a href="" @click.prevent="emit('select', channel)">
                {{ channel.name }}
            </a>
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { Channel } from '@/stores/messages';

const { channels } = defineProps<{
    channels: Channel[];
}>();

const emit = defineEmits<{
    select: [Channel];
}>();
</script>
