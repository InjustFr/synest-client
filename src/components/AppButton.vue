<template>
    <button
        class="btn"
        :class="classes"
        :type="type"
        @click="emit('click', $event)"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const { variant = 'primary', icon = false } = defineProps<{
    type: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary';
    icon?: boolean;
}>();

const emit = defineEmits<{
    click: [MouseEvent];
}>();

const classes = computed(() => {
    const classes = ['btn-' + variant];

    if (icon) {
        classes.push('btn-icon');
    }

    return classes;
});
</script>

<style scoped>
    .btn {
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        outline: none;
        box-shadow: none;
        border: none;
        cursor: pointer;
        font-weight: bold;

    }

    .btn-icon {
        aspect-ratio: 1;
    }

    .btn-primary {
        background: var(--persian-green);
        color: white;
    }

    .btn-primary:hover {
        background: color-mix(in hsl, var(--persian-green), black 20%);
    }

    .btn-secondary {
        background: var(--mindaro);
        color: black;
    }

    .btn-secondary:hover {
        background: color-mix(in hsl, var(--mindaro), black 20%);
    }
</style>
