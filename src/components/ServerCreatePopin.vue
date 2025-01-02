<template>
    <AppPopin
        class="server-create-popin"
        v-model="model"
    >
        <h2 class="login-popin__title">New server</h2>
        <ServerCreateForm
            @created="onCreated"
        />
    </AppPopin>
</template>

<script setup lang="ts">
import AppPopin from './AppPopin.vue';
import ServerCreateForm from './ServerCreateForm.vue';

const model = defineModel<boolean>();

const emit = defineEmits<{
    'server-created': [];
}>();

function onCreated() {
    model.value = false;
    emit('server-created');
}
</script>
