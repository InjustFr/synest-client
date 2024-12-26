<template>
    <div class="channel-list">
        <ul class="channel-list__list">
            <ChannelListElement
                v-for="channel, key in channels"
                :key="key"
                :channel="channel"
                @click="emit('select', channel)"
                @delete="deleteChannel(channel.id)"
            />
        </ul>
        <AppInput id="new-channel-name" v-model="newChannelName" placeholder="Name" />
        <AppInput id="new-channel-type" v-model="newChannelType" placeholder="Type" />
        <AppButton type="button" @click.prevent="createChannel">Add channel</AppButton>
    </div>

</template>

<script setup lang="ts">
import { ChannelType, type Channel } from '@/types/channel';
import { ref } from 'vue';
import AppButton from './AppButton.vue';
import AppInput from './AppInput.vue';
import ChannelListElement from './ChannelListElement.vue';
import { createChannel as apiCreateChannel, deleteChannel as apiDeleteChannel } from '@/api/channel';
import type { Server } from '@/types/server';

const { channels, server } = defineProps<{
    channels: Channel[];
    server: Server;
}>();

const emit = defineEmits<{
    select: [Channel];
}>();

const newChannelName = ref('');
const newChannelType = ref<ChannelType>(ChannelType.Text);

async function createChannel() {
    await apiCreateChannel({ name: newChannelName.value, type: newChannelType.value }, server.id);

    newChannelName.value = '';
}

function deleteChannel(id: string) {
    apiDeleteChannel(id, server.id);
}
</script>

<style css scoped>
.channel-list {
    width: 15vw;
    padding: 1rem;
    color: white;
    background: color-mix(in hsl, var(--space-cadet), white 5%);
    height: 100%
}

.channel-list__list {
    padding: 0;
    margin: 0;
    margin-bottom: 1rem;
}
</style>
