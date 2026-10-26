<script lang="ts">
  import Body, { type BodyProps } from '../Body.svelte'

  let args: BodyProps = $props()
</script>

<Body {...args} />

<style>
  :global(.body-demo-inset) {
    margin: 1rem;
  }
</style>
