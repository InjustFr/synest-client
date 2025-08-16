<template>
    <aside class="profile">
        <p>Username: {{ profile?.username }}</p>
        <p>Email: {{ profile?.email }}</p>
    </aside>
</template>

<script setup lang="ts">
import { useUserStore } from '@/entities/user/model/userStore';
import { storeToRefs } from 'pinia';

const { profile } = storeToRefs(useUserStore());
</script>

<style lang="css" scoped>
.profile {
    padding: 1rem;
    border-left: 2px solid var(--background);
}
</style>
