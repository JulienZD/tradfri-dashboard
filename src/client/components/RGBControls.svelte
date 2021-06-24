<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { tradfriColors } from '../../common/tradfri-colors';

  export let currentColor: string;

  const dispatch = createEventDispatcher();

  function changeColor(color): void {
    dispatch('colorChange', { color: color });
  }
</script>

<div class="mt-4 grid grid-cols-5 gap-y-3">
  {#each tradfriColors as color}
    <button
      class="rounded-full h-12 w-12 focus:ring-2 focus:outline-none ring-offset-2 ring-offset-transparent dark:ring-offset-gray-800 ring-blue-300"
      class:selected={color === currentColor}
      style="background: #{color};"
      on:click={() => changeColor(color)}
    />
  {/each}
</div>

<style>
  .selected {
    @apply ring ring-blue-500 dark:ring-green-500;
  }
</style>
