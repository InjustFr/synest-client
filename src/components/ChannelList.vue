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
    <AppInput id="new-channel-name" v-model="newChannelName" placeholder="Name" />
    <AppInput id="new-channel-type" v-model="newChannelType" placeholder="Type" />
    <AppButton type="button" @click.prevent="createChannel">Add channel</AppButton>
</template>

<script setup lang="ts">
import { ChannelType, type Channel } from '@/types/channel';
import { ref } from 'vue';
import AppButton from './AppButton.vue';
import AppInput from './AppInput.vue';
import ChannelListElement from './ChannelListElement.vue';
import { createChannel as apiCreateChannel, deleteChannel as apiDeleteChannel } from '@/api/channel';

const { channels } = defineProps<{
    channels: Channel[];
}>();

const emit = defineEmits<{
    select: [Channel];
}>();

const newChannelName = ref('');
const newChannelType = ref<ChannelType>(ChannelType.Text);

async function createChannel() {
    await apiCreateChannel({ name: newChannelName.value, type: newChannelType.value });

    newChannelName.value = '';
}

function deleteChannel(id: string) {
    apiDeleteChannel(id);
}
</script>

<style scoped>
.channel-list {
    padding: 0;
}
</style>
