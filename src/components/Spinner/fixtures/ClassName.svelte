<script lang="ts">
  import Spinner, { type SpinnerProps } from '../Spinner.svelte'

  let args: SpinnerProps = $props()
</script>

<Spinner {...args} />

<style>
  :global(.spinner-demo-inset) {
    margin: 1rem;
  }
</style>
