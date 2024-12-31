<template>
    <li class="server-list-element">
        <a
            class="server-list-element__link"
            :class="{
                'server-list-element__active': active
            }"
            href=""
            @click.prevent="emit('click', server)"
        >
            {{ server.name }}
        </a>
    </li>
</template>

<script setup lang="ts">
import type { Server } from '@/types/server';

defineProps<{
    server: Server;
    active?: boolean;
}>();

const emit = defineEmits<{
    click: [Server];
}>();
</script>

<style lang="css" scoped>
.server-list-element {
    list-style: none;
    display: flex;
    justify-content: space-between;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    background: var(--background-lighter-1);
    padding: 4px;
    text-align: center;
}

.server-list-element__link {
    color: var(--white);
    text-decoration: none;
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.server-list-element__active {
    border: 2px solid var(--primary);
}
</style>
