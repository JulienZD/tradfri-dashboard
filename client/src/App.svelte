<script lang="ts">
  import TradfriManager from './components/TradfriManager.svelte';
</script>

<main>
  <TradfriManager />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer base {
    body {
      @apply bg-gray-900 text-green-500;
    }
  }
  .btna {
    @apply p-2 border rounded border-green-500 hover:text-gray-900 hover:bg-green-500 transition-colors duration-300;
  }
</style>
