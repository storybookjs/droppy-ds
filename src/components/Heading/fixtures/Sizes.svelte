<script lang="ts">
  import Heading, { type HeadingProps } from '../Heading.svelte'

  let args: HeadingProps = $props()
</script>

{#each [1, 2, 3, 4, 5] as const as size (size)}
  <Heading {...args} level={2} {size}>h2 at size {size}</Heading>
{/each}
