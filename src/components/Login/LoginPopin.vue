<template>
    <AppPopin class="login-popin" disable-close>
        <h2 class="login-popin__title">Login</h2>
        <LoginForm
            @logged-in="emit('loggedIn')"
        />
    </AppPopin>
</template>

<script setup lang="ts">
import AppPopin from '../AppPopin.vue';
import LoginForm from './LoginForm.vue';

const emit = defineEmits<{
    loggedIn: [];
}>();
</script>

<style scoped>
.login-popin :deep(.popin) {
    width: 30%;
}

.login-popin__title {
    text-align: center;
}
</style>
