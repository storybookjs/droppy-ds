<script lang="ts">
  import Heading, { type HeadingProps } from '../Heading.svelte'

  let args: HeadingProps = $props()
</script>

<Heading {...args} />

<style>
  :global(.heading-demo-inset) {
    margin: 1rem;
  }
</style>
