<template>
    <ul class="server-list">
        <ServerListElement
            v-for="server in servers"
            :key="server.id"
            @click="model = server"
            :server="server"
            class="server-list__element"
            :active="model === server"
        >
            {{ server.name }}
            <span
                class="server-list__remove"
                @click.stop.prevent="removeServer(server)"
            >
                <X />
            </span>
        </ServerListElement>
        <ServerListElement
            @click="showServerCreateModal = true"
            class="server-list__element"
        >
            <Plus />
        </ServerListElement>
    </ul>
    <Teleport
        defer
        to="#modals"
    >
        <ServerCreatePopin
            v-model="showServerCreateModal"
            @server-created="emit('server-created')"
        />
    </Teleport>
</template>

<script setup lang="ts">
import { useServerStore } from '@/stores/server';
import ServerListElement from './ServerListElement.vue';
import { storeToRefs } from 'pinia';
import type { Server } from '@/types/server';
import { ref } from 'vue';
import { Plus, X } from 'lucide-vue-next';
import ServerCreatePopin from './ServerCreatePopin.vue';
import { useUserStore } from '@/stores/user';
import { leaveServer, deleteServer } from '@/api/server';

const { servers } = storeToRefs(useServerStore());
const { profile } = storeToRefs(useUserStore());

const model = defineModel<Server | null>();

const showServerCreateModal = ref<boolean>(false);

const emit = defineEmits<{
    'server-created': [];
    'server-removed': [];
}>();

async function removeServer(server: Server) {
    if (server.owner.id === profile.value?.id) {
        await deleteServer(server.id);
        emit('server-removed');
        return;
    }

    await leaveServer(server.id);
    emit('server-removed');
}
</script>

<style lang="css" scoped>
.server-list {
    padding: 1rem 0.75rem;
    margin: 0;
    background: var(--primary-lighter-1);
    height: 100%;
    width: 5rem;
}

.server-list .server-list__element:not(:first-child) {
    margin-top: 1rem;
}

.server-list__element {
    position: relative;
}

.server-list__remove {
    position: absolute;
    top: 0.125rem;
    right: 0.125rem;
    transform: translate(50%, -50%);
    width: 1.2rem;
    height: 1.2rem;
    color: var(--danger);
}

.server-list__remove .lucide {
    width: 100%;
    height: 100%;
}
</style>
