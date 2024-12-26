<template>
    <aside class="profile">
        <p>Username: {{ profile?.username }}</p>
        <p>Email: {{ profile?.email }}</p>
    </aside>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const { profile } = storeToRefs(useUserStore());
</script>

<style lang="css" scoped>
.profile {
    background: color-mix(in hsl, var(--space-cadet), white 5%);
    padding: 1rem;
}
</style>
