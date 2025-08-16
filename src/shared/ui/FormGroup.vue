<template>
    <div class="form-group">
        <label v-if="label" class="form-group__label">{{ label }}</label>
        <slot />
    </div>
</template>

<script setup lang="ts">
const { label = '' } = defineProps<{
    label?: string;
    for?: string;
}>();
</script>
<style lang="css" scoped>
.form-group {
    margin-bottom: 1rem;
}

.form-group__label {
    margin-bottom: 0.25rem;
    display: block;
}
</style>
