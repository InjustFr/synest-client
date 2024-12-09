<template>
    <textarea
        class="textarea"
        v-model="model"
    ></textarea>
</template>

<script setup lang="ts">
const model = defineModel<string>();

</script>
<style>
    .textarea {
        background: color-mix(in hsl, var(--space-cadet), white 15%);
        border: none;
        border-radius: 1rem;
        min-height: 4rem;
        padding: 1rem;
        color: white;
        resize: none;
    }
</style>
