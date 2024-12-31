<template>
    <ul class="server-list">
        <ServerListElement
            v-for="server in servers"
            :key="server.id"
            @click="model = $event"
            :server="server"
            class="server-list__element"
            :active="model === server"
        />
    </ul>
</template>

<script setup lang="ts">
import { useServerStore } from '@/stores/server';
import ServerListElement from './ServerListElement.vue';
import { storeToRefs } from 'pinia';
import type { Server } from '@/types/server';

const { servers } = storeToRefs(useServerStore());

const model = defineModel<Server | null>();
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
</style>
