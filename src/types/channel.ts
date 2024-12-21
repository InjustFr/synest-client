export type Message = {
    id: string;
    username: string;
    content: string;
};

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
