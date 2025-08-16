import { ref } from 'vue';

let eventSource: EventSource | null = null;
const eventHandlers: Map<string, (message: unknown) => void> = new Map();
const open = ref(false);

export function useEventSource() {
    function init(url: URL) {
        if (eventSource) {
            close();
        }

        eventSource = new EventSource(url);
        eventSource.onopen = onOpen;
        eventSource.onerror = onError;
        eventSource.onmessage = onMessage;
    }

    function close() {
        eventSource?.close();
        open.value = false;
    }

    function onOpen(event: Event) {
        open.value = true;
    }

    function onError(event: Event) {
        console.error('Error using EventSource:', event);
    }

    function onMessage(event: MessageEvent) {
        const recievedMessage = JSON.parse(event.data);
        const handler = eventHandlers.get(recievedMessage.type);
        if (handler) {
            handler(recievedMessage.data);
        }
    }

    function addHandler(event: string, handler: (message: unknown) => void) {
        eventHandlers.set(event, handler);
    }

    function removeHandler(event: string) {
        eventHandlers.delete(event);
    }

    return {
        open,
        init,
        close,
        addHandler,
        removeHandler,
    };
}
