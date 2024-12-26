<template>
    <li class="server-list-element">
        <a
            class="server-list-element__link"
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
}

.server-list-element__link {
    padding: 0.25rem 1rem;
    color: white;
    text-decoration: none;
    width: 100%;
    display: inline-block;
}
</style>
