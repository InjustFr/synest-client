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
        background: var(--background-lighter-2);
        border: none;
        border-radius: 1rem;
        min-height: 4rem;
        padding: 1rem;
        color: var(--white);
        resize: none;
        width: 100%;
    }
</style>
