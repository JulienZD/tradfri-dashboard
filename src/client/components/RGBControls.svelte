<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let color: string;

  const dispatch = createEventDispatcher();

  const tradfriColors = [
    'ebb63e',
    'efd275',
    'f1e0b5',
    'f2eccf',
    'f5faf6',
    'e78834',
    'e491af',
    'e8bedd',
    'd6e44b',
    'eaf6fb',
    'e57345',
    'd9337c',
    'c984bb',
    'a9d62b',
    'dcf0f8',
    'da5d41',
    'dc4b31',
    '8f2686',
    '4a418a',
    '6c83ba',
  ];

  function changeColor(a): void {
    dispatch('colorChange', { color: a });
  }
</script>

<div class="mt-4 grid grid-cols-5 gap-y-3">
  {#each tradfriColors as aColor}
    <button
      class="rounded-full h-12 w-12"
      class:selected={aColor === color}
      style="background: #{aColor};"
      on:click={() => changeColor(aColor)}
    />
  {/each}
</div>

<style>
  button {
    @apply focus:outline-none;
  }
  .selected {
    @apply ring ring-offset-2 ring-offset-gray-800 ring-green-500;
  }
</style>
