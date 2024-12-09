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

const { variant = 'primary' } = defineProps<{
    type: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary';
}>();

const emit = defineEmits<{
    click: [MouseEvent];
}>();

const classes = computed(() => {
    return [
        'btn-' + variant,
    ];
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
