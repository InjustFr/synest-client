import type { UserProfile } from '@/types/user';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
    const token = ref<string | null>(null);

    const profile = ref<UserProfile | null>(null);

    const isLoggedIn = computed(() => {
        return token.value !== null;
    });

    return { token, profile, isLoggedIn };
});
