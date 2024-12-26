import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/user';
import type { UserProfile } from '@/types/user';
import type { Server } from '@/types/server';

export async function getProfile(): Promise<UserProfile> {
    const { token } = storeToRefs(useUserStore());

    const result = await fetch('/api/user/profile', {
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

export async function getServers(): Promise<{ servers: Server[]; hubUrl: string }> {
    const { token } = storeToRefs(useUserStore());

    const result = await fetch('/api/user/servers', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + token.value,
        },
    });

    if (result.ok) {
        const linkHeader = result.headers.get('Link');
        let hubUrl = '';
        if (linkHeader) {
            const matches = linkHeader.match(/<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/);
            if (matches) {
                hubUrl = matches[1];
            }
        }

        return {
            servers: await result.json(),
            hubUrl,
        };
    }

    throw new Error('Error while fetching profile servers');
}
