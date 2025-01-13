<template>
    <AppPopin
        v-model="model"
        fullscreen
        >
        <h2>
            Settings for {{ server.name }}
        </h2>
        <form
            @submit.prevent
        >
            <FormGroup
                v-for="value, key in settings"
                :key="key"
                :label="key"
            >
                <AppInput
                    :model-value="value"
                    @change="updateSetting(key, $event)"
                />
            </FormGroup>
            <AppButton
                type="submit"
                @click="model = false"
            >
                Valider
            </AppButton>
        </form>
    </AppPopin>
</template>

<script setup lang="ts">
import { getSettings, updateSetting as apiUpdateSetting } from '@/api/server';
import AppPopin from './AppPopin.vue';
import type { Server } from '@/types/server';
import FormGroup from './FormGroup.vue';
import AppInput from './AppInput.vue';
import AppButton from './AppButton.vue';

const model = defineModel<boolean>();

const { server } = defineProps<{
    server: Server;
}>();

const settings = await getSettings(server.id);

async function updateSetting(key: string, value: unknown) {
    await apiUpdateSetting(server.id, { key, value });
}

</script>
