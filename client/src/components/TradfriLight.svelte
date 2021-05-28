<script lang="ts">
  import { tick } from 'svelte';
  import RangeSlider from 'svelte-range-slider-pips';
  import { Jumper } from 'svelte-loading-spinners';
  import Toggle from 'svelte-toggle';
  import type { TradfriLightInfo } from '../types';
  import { controlLight } from '../utils/controller';
  import RgbControls from './RGBControls.svelte';

  export let light: TradfriLightInfo;

  let updating: boolean;

  const operateLight = async (operation): Promise<void> => {
    updating = true;
    const result = await controlLight(light.id, operation);
    if (result) {
      light = { ...result };
      await tick();
    }
    updating = false;
  };

  const toggle = async (): Promise<void> => {
    await operateLight({ on: !light.isOn });
  };

  const setBrightness = async ({ detail: { value } }): Promise<void> => {
    if (value === light.brightness) return;
    await operateLight({ brightness: value });
  };

  const changeColor = async({detail: { color } }): Promise<void> => {
    if (color === light.color) return;
    await operateLight({color: color})
  }
</script>

<div class="flex flex-col my-1">
  <div class="flex justify-between mb-3">
    {#if updating}
      <Jumper size="20" color="#10B981" />
    {:else}
      <h2 class="font-medium text-lg">{light.name}</h2>
    {/if}
    <Toggle hideLabel toggledColor="#10b981" toggled={light.isOn} on:click={toggle} disabled={updating} />
  </div>

  <RangeSlider float suffix="%" on:stop={setBrightness} disabled={updating} values={[light.brightness]} />

  {#if light.hue}
    <RgbControls color={light.color} on:colorChange={changeColor} {updating}/>
  {/if}
</div>

<style>
  /* RangeSlider */
  :root {
    --range-slider: #10b981; /* slider main background color */
    --range-handle-inactive: #047857; /* inactive handle color */
    --range-handle: #34d399; /* non-focussed handle color */
    --range-handle-focus: #059669; /* focussed handle color */
  }

  :global(.rangeSlider) {
    margin: 4px 0 !important;
    margin-right: 8px !important;
  }
</style>
