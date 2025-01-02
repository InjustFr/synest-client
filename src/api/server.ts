import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

export async function createServer(data: { name: string }) {
    const { token } = storeToRefs(useUserStore());

    const result = await fetch('/api/servers', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Authorization': 'Bearer ' + token.value,
            'Content-Type': 'application/json',
        },
    });

    if (result.ok) {
        return await result.json();
    }

    throw new Error('Error while creating server');
}

export async function leaveServer(id: string) {
    const { token } = storeToRefs(useUserStore());

    const result = await fetch('/api/servers/' + id + '/leave', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + token.value,
        },
    });

    if (result.ok) {
        return;
    }

    throw new Error('Error while leaving server ' + id);
}

export async function deleteServer(id: string) {
    const { token } = storeToRefs(useUserStore());

    const result = await fetch('/api/servers/' + id, {
        method: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + token.value,
        },
    });

    if (result.ok) {
        return;
    }

    throw new Error('Error while deleting server ' + id);
}
