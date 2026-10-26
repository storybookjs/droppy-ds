<script lang="ts">
  import Select, { type SelectProps } from '../Select.svelte'

  let args: SelectProps = $props()
</script>

<Select {...args} />

<style>
  :global(.select-demo-inset) {
    margin: 1rem;
  }
</style>
