import { defineStore } from 'pinia';
import { ref } from 'vue';

export type Message = {
    username: string;
    message: string;
};

export type Channel = {
    name: string;
    messages: Message[];
};

export const useMessagesStore = defineStore('messages', () => {
    const channels = ref<Channel[]>([
        {
            name: 'channel 1',
            messages: [],
        },
        {
            name: 'channel 2',
            messages: [],
        },
    ]);

    return { channels };
});
