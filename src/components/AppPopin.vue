<template>
    <div class="popin-container">
        <div class="popin">
            <a v-if="!disableClose" href="" class="popin__close" @click="emit('close')"><X /></a>
            <div class="popin__content">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';

const { disableClose = false } = defineProps<{
    disableClose?: boolean;
}>();

const emit = defineEmits<{
    close: [];
}>();
</script>

<style scoped>
.popin-container {
    background: hsla(248, 0%, 0%, 0.7);
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.popin {
    padding: 2rem;
    position: relative;
    background: var(--space-cadet);
    border-radius: 1rem;
}

.popin__close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 2rem;
    color: white;
    text-decoration: none;
}
</style>
