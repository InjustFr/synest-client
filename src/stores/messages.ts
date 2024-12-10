import type { Channel } from '@/types/channel';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMessagesStore = defineStore('messages', () => {
    const channels = ref<Channel[]>([]);

    return { channels };
});
