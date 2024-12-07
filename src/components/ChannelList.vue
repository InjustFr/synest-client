<template>
    <ul>
        <li
            v-for="channel, key in channels"
            :key="key"
        >
            <a href="" @click.prevent="emit('select', channel)">
                {{ channel.name }}
            </a>
            <a href="" @click.prevent="deleteChannel(channel.id)">
                x
            </a>
        </li>
    </ul>
    <input id="new-channel-name" v-model="newChannelName" />
    <button type="button" href="" @click.prevent="createChannel">Add channel</button>
</template>

<script setup lang="ts">
import type { Channel } from '@/stores/messages';
import { ref } from 'vue';

const { channels } = defineProps<{
    channels: Channel[];
}>();

const emit = defineEmits<{
    select: [Channel];
}>();

const newChannelName = ref('');

async function createChannel() {
    await fetch('/api/channels', {
        method: 'POST',
        body: JSON.stringify({
            name: newChannelName.value,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    newChannelName.value = '';
}

function deleteChannel(id: string) {
    fetch('/api/channels/' + id, {
        method: 'DELETE',
    });
}
</script>
