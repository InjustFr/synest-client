export type Message = {
    id: string;
    username: string;
    content: string;
};

export type Channel = {
    id: string;
    name: string;
    messages: Message[];
};
