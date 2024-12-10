<template>
    <ul class="channel-list">
        <ChannelListElement
            v-for="channel, key in channels"
            :key="key"
            :channel="channel"
            @click="emit('select', channel)"
            @delete="deleteChannel(channel.id)"
        />
    </ul>
    <AppInput id="new-channel-name" v-model="newChannelName" />
    <AppButton type="button" @click.prevent="createChannel">Add channel</AppButton>
</template>

<script setup lang="ts">
import type { Channel } from '@/types/channel';
import { ref } from 'vue';
import AppButton from './AppButton.vue';
import AppInput from './AppInput.vue';
import ChannelListElement from './ChannelListElement.vue';

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

<style scoped>
.channel-list {
    padding: 0;
}
</style>
