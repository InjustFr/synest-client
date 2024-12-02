<template>
    <ul>
        <li
            v-for="channel, key in channels"
            :key="key"
        >
            <a href="" @click.prevent="emit('select', channel)">
                {{ channel }}
            </a>
        </li>
    </ul>
</template>

<script setup lang="ts">
const { channels } = defineProps<{
    channels: string[];
}>();

const emit = defineEmits<{
    select: [string];
}>();
</script>