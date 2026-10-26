<script lang="ts">
  import Heading, { type HeadingProps } from '../Heading.svelte'

  let args: HeadingProps = $props()
</script>

{#each [1, 2, 3, 4, 5] as const as level (level)}
  <Heading {...args} {level}>Level {level}</Heading>
{/each}
