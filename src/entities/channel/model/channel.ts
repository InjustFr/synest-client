import type { Message } from '@/entities/message/model/message';

export enum ChannelType {
    Text = 'text',
    Video = 'video',
}

export type Channel = {
    id: string;
    name: string;
    type: ChannelType;
    messages: Message[];
};
