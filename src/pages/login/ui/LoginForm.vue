<template>
    <form
        class="login-form"
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
import { AppButton, AppInput, FormGroup } from '@/shared/ui';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/entities/user/model/userStore';
import { getProfile } from '@/entities/user/api/user';

const emit = defineEmits<{
    loggedIn: [];
}>();

const email = ref('');
const password = ref('');

const { token, profile } = storeToRefs(useUserStore());

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
        token.value = (await result.json()).token;
        emit('loggedIn');

        profile.value = await getProfile();
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
