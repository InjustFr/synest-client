import type { Server } from '@/types/server';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useServerStore = defineStore('server', () => {
    const servers = ref<Server[]>([]);

    return { servers };
});
