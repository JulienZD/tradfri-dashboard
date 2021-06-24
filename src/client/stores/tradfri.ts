import { readable } from 'svelte/store';
import type { TradfriEvents, TradfriLightInfo } from '../../common';

interface TradfriEventSource extends EventSource {
  addEventListener<K extends keyof TradfriEvents>(
    type: K,
    listener: (this: EventSource, ev: MessageEvent) => any
  ): void;
}

let lightData: TradfriLightInfo[] = [];

export const lightsStore = readable(lightData, (set) => {
  const sse = new EventSource('/tradfri-events') as TradfriEventSource;
  sse.onopen = () => {
    console.debug('Eventstream opened');
  };

  sse.addEventListener('lightUpdate', (event) => {
    const lightInfo: TradfriLightInfo = JSON.parse(event.data);

    // This seems like the incorrect way to do this
    lightData = lightData.filter((c) => c.id !== lightInfo.id).concat(lightInfo);
    set(lightData);
  });

  return () => sse.close();
});
