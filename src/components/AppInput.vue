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
        background: var(--background-lighter-2);
        border: none;
        border-radius: 1rem;
        padding: 0.5rem 1rem;
        color: var(--white);
        width: 100%;
        display: block;
    }
</style>
