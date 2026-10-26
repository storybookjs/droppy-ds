<script lang="ts">
  import NumberField, { type NumberFieldProps } from '../NumberField.svelte'

  let args: NumberFieldProps = $props()
</script>

<NumberField {...args} />

<style>
  :global(.numberfield-demo-inset) {
    margin: 1rem;
  }
</style>
