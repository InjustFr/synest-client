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
import { getSettings, updateSetting as apiUpdateSetting } from '@/entities/server/api/server';
import AppPopin from '@/shared/ui/AppPopin.vue';
import type { Server } from '@/entities/server/model/server';
import FormGroup from '@/shared/ui/FormGroup.vue';
import AppInput from '@/shared/ui/AppInput.vue';
import AppButton from '@/shared/ui/AppButton.vue';

const model = defineModel<boolean>();

const { server } = defineProps<{
    server: Server;
}>();

const settings = await getSettings(server.id);

async function updateSetting(key: string, value: unknown) {
    await apiUpdateSetting(server.id, { key, value });
}

</script>
