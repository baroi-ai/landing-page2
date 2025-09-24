// src/lib/eventEmitter.ts
type EventCallback = (data?: any) => void;

class EventEmitter {
  private events: { [key: string]: EventCallback[] } = {};

  on(eventName: string, callback: EventCallback): () => void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    // Return an unsubscribe function
    return () => {
      this.events[eventName] = this.events[eventName].filter(
        (cb) => cb !== callback
      );
    };
  }

  emit(eventName: string, data?: any): void {
    const eventCallbacks = this.events[eventName];
    if (eventCallbacks) {
      eventCallbacks.forEach((callback) => callback(data));
    }
  }
}

export const appEmitter = new EventEmitter();