<template>
    <input
        class="input"
        v-model="model"
    />
</template>

<script setup lang="ts">
const model = defineModel<string>();

</script>
<style>
    .input {
        background: color-mix(in hsl, var(--space-cadet), white 15%);
        border: none;
        border-radius: 1rem;
        padding: 0.5rem 1rem;
        color: white;
    }
</style>
