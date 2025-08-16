<template>
    <div
        class="popin-container"
        v-if="model"
    >
        <div
            class="popin"
            :class="classes"
        >
            <a v-if="!disableClose" href="" class="popin__close" @click.prevent="model = false"><X /></a>
            <div class="popin__content">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { computed } from 'vue';

const { disableClose = false, fullscreen = false } = defineProps<{
    disableClose?: boolean;
    fullscreen?: boolean;
}>();

const model = defineModel<boolean>();

const classes = computed(() => {
    return {
        'popin--fullscreen': fullscreen,
    };
});
</script>

<style scoped>
.popin-container {
    background: color-mix(in hsl, var(--background) 80%, transparent);
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
    background: var(--background-lighter-1);
    border-radius: 1rem;
}

.popin__close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 2rem;
    color: var(--white);
    text-decoration: none;
}

.popin--fullscreen {
    width: 100vw;
    height: 100vh;
}
</style>
