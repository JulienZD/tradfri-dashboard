<script lang="ts">
  import TradfriRoom from './TradfriRoom.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';
  import type { ControllableRoom } from '../../common';

  let rooms: ControllableRoom[] = [];

  onMount(async () => {
    try {
      const { data } = await axios.get(`/rooms`);
      rooms = data;
    } catch (e) {
      console.error(e);
    }
  });
</script>

<div class="flex justify-center items-center flex-col md:flex-row md:items-start">
  {#each rooms as room}
    <TradfriRoom {room} />
  {/each}
</div>
