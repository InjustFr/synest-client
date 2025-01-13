<template>
    <div class="channel-list">
        <div class="channel-list__server-head">
            <h2 class="channel-list__server-title">
                {{ server?.name }}
            </h2>
            <AppDropdown>
                <template #link>
                    <Ellipsis />
                </template>
                <template #content>
                    <ul
                        class="server-menu"
                    >
                        <li
                            class="server-menu__element"
                        >
                            <a
                                href=""
                                class="server-menu__link"
                                @click.prevent="settingsModelOpened = true"
                            >
                                Settings
                            </a>
                        </li>
                    </ul>
                </template>
            </AppDropdown>
        </div>
        <ul class="channel-list__list">
            <ChannelListElement
                v-for="channel, key in channels"
                :key="key"
                :channel="channel"
                @click="emit('select', channel)"
                @delete="deleteChannel(channel.id)"
            />
        </ul>
        <AppInput id="new-channel-name" v-model="newChannelName" placeholder="Name" />
        <AppInput id="new-channel-type" v-model="newChannelType" placeholder="Type" />
        <AppButton type="button" @click.prevent="createChannel">Add channel</AppButton>
        <Teleport
            defer
            to="#modals"
        >
            <Suspense>
                <ServerSettingsPopin
                    v-model="settingsModelOpened"
                    :server="server"
                />
            </Suspense>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ChannelType, type Channel } from '@/types/channel';
import { ref } from 'vue';
import AppButton from './AppButton.vue';
import AppInput from './AppInput.vue';
import ChannelListElement from './ChannelListElement.vue';
import { createChannel as apiCreateChannel, deleteChannel as apiDeleteChannel } from '@/api/channel';
import type { Server } from '@/types/server';
import { Ellipsis } from 'lucide-vue-next';
import ServerSettingsPopin from './ServerSettingsPopin.vue';
import AppDropdown from './AppDropdown.vue';

const { channels, server } = defineProps<{
    channels: Channel[];
    server: Server;
}>();

const emit = defineEmits<{
    select: [Channel];
}>();

const newChannelName = ref('');
const newChannelType = ref<ChannelType>(ChannelType.Text);
const settingsModelOpened = ref(false);

async function createChannel() {
    await apiCreateChannel({ name: newChannelName.value, type: newChannelType.value }, server.id);

    newChannelName.value = '';
}

function deleteChannel(id: string) {
    apiDeleteChannel(id, server.id);
}
</script>

<style css scoped>
.channel-list {
    width: 15vw;
    padding: 1rem;
    color: var(--white);
    height: 100%;
    border-right: 2px solid var(--background);
}

.channel-list__list {
    padding: 0;
    margin: 0;
    margin-bottom: 1rem;
}

.channel-list__server-head {
    padding: 0 1rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.channel-list__server-title {
    padding: 0;
    margin: 0;
}

.server-menu {
    padding: 0;
    margin: 0;
}

.server-menu__element {
    list-style: none;
    margin: 0 -1rem;
}

.server-menu__link {
    display: inline-block;
    text-decoration: none;
    color: inherit;
    width: 100%;
    padding: 0 1rem;
}

</style>
