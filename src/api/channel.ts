import { useUserStore } from '@/stores/user';
import type { Channel, ChannelType } from '@/types/channel';
import { storeToRefs } from 'pinia';

export async function getChannels(serverId: string): Promise<Channel[]> {
    const { token } = storeToRefs(useUserStore());

    const result = await fetch('/api/servers/' + serverId + '/channels', {
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

export async function createChannel(data: { name: string; type: ChannelType }, serverId: string): Promise<Channel> {
    const { token } = storeToRefs(useUserStore());

    const result = await fetch('/api/servers/' + serverId + '/channels', {
        method: 'POST',
        body: JSON.stringify(data),
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

export async function deleteChannel(id: string, serverId: string) {
    const { token } = storeToRefs(useUserStore());

    const result = await fetch('/api/servers/' + serverId + '/channels/' + id, {
        method: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + token.value,
        },
    });

    if (result.ok) {
        return;
    }

    throw new Error('Error while deleting channel ' + id);
}
