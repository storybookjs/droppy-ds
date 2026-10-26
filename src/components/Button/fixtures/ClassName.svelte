<script lang="ts">
  import Button, { type ButtonProps } from '../Button.svelte'

  let args: ButtonProps = $props()
</script>

<Button {...args} />

<style>
  :global(.button-demo-inset) {
    margin: 1rem;
  }
</style>
