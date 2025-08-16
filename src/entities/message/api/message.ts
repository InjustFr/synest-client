import { useUserStore } from '@/entities/user';
import { storeToRefs } from 'pinia';
import type { Message } from '../model/message';

export async function getMessages(serverId: string, channelId: string): Promise<Message[]> {
    const { token } = storeToRefs(useUserStore());

    const result = await fetch(`/api/servers/${serverId}/channels/${channelId}/messages`, {
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

export async function createMessage(
    data: { content: string },
    serverId: string,
    channelId: string,
): Promise<Message> {
    const { token } = storeToRefs(useUserStore());

    const result = await fetch(`/api/servers/${serverId}/channels/${channelId}/messages`, {
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
