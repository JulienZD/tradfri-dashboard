<script lang="ts">
  import type { ControllableRoom } from '../../server/types';
  import TradfriLight from './TradfriLight.svelte';
  export let room: ControllableRoom;
</script>

<div class="flex border-4 border-gray-800 bg-gray-800 rounded-xl m-2 flex-col w-96">
  <h1 class="pl-2 py-1 text-lg font-bold rounded-t-lg bg-gray-900">{room.name}</h1>
  <div class="flex flex-col flex-grow p-2 mt-2 justify-around">
    {#each room.lights as light}
      <TradfriLight {light} />
    {/each}
  </div>
</div>
