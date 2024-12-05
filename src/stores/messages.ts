import { defineStore } from 'pinia';
import { ref } from 'vue';

export type Message = {
    id: string;
    username: string;
    message: string;
};

export type Channel = {
    id: string;
    name: string;
    messages: Message[];
};

export const useMessagesStore = defineStore('messages', () => {
    const channels = ref<Channel[]>([]);

    return { channels };
});
