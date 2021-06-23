<script lang="ts">
  import TradfriRoom from './TradfriRoom.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';
  import type { ControllableRoom } from '../types';

  let rooms: ControllableRoom[] = [];

  onMount(async () => {
    try {
      const { data } = await axios.get(`/rooms`);
      console.log(data);
      rooms = data;
    } catch (e) {
      console.error(e);
    }
    const sse = new EventSource('http://localhost:3001/light-events');

    sse.onopen = (event) => {
      console.log('opened');
      status = 'open';
    };

    sse.onmessage = (event) => {
      status = 'Message received!';
      console.log(event.data);
    };

    return () => {
      if (sse.readyState && sse.readyState === 1) {
        sse.close();
      }
    };
  });
</script>

<h1 class="text-center text-7xl mb-4">Trådfri</h1>
<div class="flex justify-center items-center flex-col md:flex-row md:items-start">
  {#each rooms as room}
    <TradfriRoom {room} />
  {/each}
</div>
