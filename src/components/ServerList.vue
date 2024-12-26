<template>
    <ul class="server-list">
        <ServerListElement
            v-for="server in servers"
            :key="server.id"
            @click="model = $event"
            :server="server"
            :class="{
                'server-list-element__active': model === server
            }"
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
    padding: 0;
    padding-top: 1rem;
    margin: 0;
    background: color-mix(in hsl, var(--space-cadet), white 10%);
    height: 100%;
}

.server-list-element__active {
    background: color-mix(in hsl, var(--space-cadet), white 5%);
}
</style>
