<template>
    <div
        class="dropdown"
        ref="dropdown"
    >
        <a
            href=""
            class="dropdown__link"
            @click.prevent="opened = !opened"
        >
            <slot
                name="link"
            />
        </a>
        <div
            class="dropdown__content"
            :class="menuClasses"
        >
            <slot
                name="content"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';

const opened = ref<boolean>(false);

const menuClasses = computed(() => {
    return {
        'dropdown__content--opened': opened.value,
    };
});

const dropdownRef = useTemplateRef('dropdown');

const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains((event.target as Node | null)) && opened.value === true) {
        opened.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="css" scoped>
.dropdown {
    position: relative;
}

.dropdown__link {
    color: inherit;
    text-decoration: none;
}

.dropdown__content {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 7rem;
    padding: 1rem;
}

.dropdown__content--opened {
    display: block;
    background: var(--background);
    border: 1px solid var(--background);
    font-size: 1rem;
}
</style>
