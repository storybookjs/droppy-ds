<script lang="ts">
  import ErrorBlock, { type ErrorBlockProps } from '../ErrorBlock.svelte'

  let args: ErrorBlockProps = $props()
</script>

<ErrorBlock {...args} />

<style>
  :global(.errorblock-demo-inset) {
    margin: 1rem;
  }
</style>
