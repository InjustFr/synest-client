<template>
    <form
        clas="server-create-form"
        @submit.prevent="createServer"
    >
        <FormGroup
            label="Name"
        >
            <AppInput
                id="server-create-name"
                v-model="name"
            />
        </FormGroup>
        <AppButton
            type="submit"
            class="login-form__login-button"
        >
            Add
        </AppButton>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppButton from './AppButton.vue';
import AppInput from './AppInput.vue';
import FormGroup from './FormGroup.vue';
import { createServer as apiCreateServer } from '@/api/server';

const emit = defineEmits<{
    created: [];
}>();

const name = ref('');

async function createServer() {
    await apiCreateServer({
        name: name.value,
    });

    emit('created');
}
</script>

<style scoped>
.login-form__login-button {
    margin: auto;
    display: block;
    margin-top: 2rem;
}
</style>
