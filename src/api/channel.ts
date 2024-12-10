import { useUserStore } from '@/stores/user';
import type { Channel } from '@/types/channel';
import { storeToRefs } from 'pinia';

export async function getChannels(): Promise<Channel[]> {
    const { token } = storeToRefs(useUserStore());

    const result = await fetch('/api/channels', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + token.value,
        },
    });

    if (result.ok) {
        return await result.json();
    }

    throw new Error('Error while fetching channels');
}
