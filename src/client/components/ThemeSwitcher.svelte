<script lang="ts">
  import { theme } from '../stores/theme';
  import { SunIcon, MoonIcon } from 'svelte-feather-icons';
</script>

<button
  class="group float-right border-none py-1 px-2 rounded focus:outline-none focus-visible:ring focus-visible:ring-blue-500"
  on:click={theme.swap}
>
  {#if $theme === 'dark'}
    <SunIcon class="group-hover:fill-current" size="24" />
  {:else}
    <MoonIcon size="24" class="group-hover:fill-current" />
  {/if}
</button>
