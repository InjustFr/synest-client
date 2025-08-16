import type { Channel } from './channel';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChannelsStore = defineStore('channels', () => {
    const channels = ref<Channel[]>([]);

    return { channels };
});
