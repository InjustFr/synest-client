<template>
    <form
        clas="login-form"
        @submit.prevent="login"
    >
        <FormGroup
            label="Email"
        >
            <AppInput
                id="login-email"
                v-model="email"
            />
        </FormGroup>
        <FormGroup
            label="Password"
        >
            <AppInput
                id="login-password"
                type="password"
                v-model="password"
            />
        </FormGroup>
        <AppButton
            type="submit"
            class="login-form__login-button"
        >
            Login
        </AppButton>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppButton from '../AppButton.vue';
import AppInput from '../AppInput.vue';
import FormGroup from '../FormGroup.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const emit = defineEmits<{
    loggedIn: [];
}>();

const email = ref('');
const password = ref('');

const { token } = storeToRefs(useUserStore());

async function login() {
    const result = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (result.ok) {
        token.value = await result.json();
        emit('loggedIn');
    }
}
</script>

<style scoped>
.login-form__login-button {
    margin: auto;
    display: block;
    margin-top: 2rem;
}
</style>
