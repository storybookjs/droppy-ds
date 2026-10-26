<!-- Holds the value in state, so the controlled stepper responds to clicks in stories. -->
<script lang="ts">
  import QuantityStepper, { type QuantityStepperProps } from '../QuantityStepper.svelte'

  let { value: initialValue, onChange, ...args }: QuantityStepperProps = $props()

  // Writable derived: follows the arg when the control changes, and can
  // still be set locally by the demo's own interactions.
  let value = $derived(initialValue)
</script>

<QuantityStepper
  {...args}
  {value}
  onChange={(next) => {
    value = next
    onChange(next)
  }}
/>
