<script lang="ts">
  import type { QuantityStepperProps } from '../QuantityStepper.svelte'
  import StepperDemo from './StepperDemo.svelte'

  let args: QuantityStepperProps = $props()
</script>

<StepperDemo {...args} />

<style>
  :global(.quantitystepper-demo-inset) {
    margin: 1rem;
  }
</style>
