<script lang="ts">
  import type { ControllableRoom } from '../../common';
  import TradfriLight from './TradfriLight.svelte';
  export let room: ControllableRoom;
</script>

<div
  class="flex border-4 bg-gray-100 border-transparent shadow-xl dark:shadow-none dark:border-gray-800 dark:bg-gray-800 rounded-xl m-2 flex-col w-96"
>
  <h1 class="pl-2 py-1 text-lg font-bold rounded-t-lg dark:bg-gray-900">{room.name}</h1>
  <div class="flex flex-col flex-grow p-2 mt-2 justify-around">
    {#each room.lights as light (light.id)}
      <TradfriLight {light} />
    {/each}
  </div>
</div>
