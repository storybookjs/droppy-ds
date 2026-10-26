<script lang="ts">
  import Input, { type InputProps } from '../Input.svelte'

  let args: InputProps = $props()
</script>

<Input {...args} />

<style>
  :global(.input-demo-inset) {
    margin: 1rem;
  }
</style>
