import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/user';
import type { UserProfile } from '@/types/user';

export async function getProfile(): Promise<UserProfile> {
    const { token } = storeToRefs(useUserStore());

    const result = await fetch('/api/profile', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + token.value,
        },
    });

    if (result.ok) {
        return await result.json();
    }

    throw new Error('Error while fetching profile');
}
