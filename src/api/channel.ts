import { useUserStore } from '@/stores/user';
import type { Channel, ChannelType } from '@/types/channel';
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

export async function createChannel({ name, type }: { name: string; type: ChannelType }): Promise<Channel> {
    const { token } = storeToRefs(useUserStore());

    const result = await fetch('/api/channels', {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            type: type,
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token.value,
        },
    });

    if (result.ok) {
        return await result.json();
    }

    throw new Error('Error while creating channel');
}

export async function deleteChannel(id: string) {
    const { token } = storeToRefs(useUserStore());

    const result = await fetch('/api/channels/' + id, {
        method: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + token.value,
        },
    });

    if (result.ok) {
        return await result.json();
    }

    throw new Error('Error while deleting channel ' + id);
}
