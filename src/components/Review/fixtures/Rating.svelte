<script lang="ts">
  import Review, { type ReviewProps } from '../Review.svelte'

  let {
    ratings = [1, 3, 4.5, 5],
    withEmpty = true,
    ...args
  }: ReviewProps & {
    ratings?: number[]
    withEmpty?: boolean
  } = $props()
</script>

<div style="display: grid; gap: 0.25rem">
  {#each ratings as rating (rating)}
    <Review {...args} {rating} />
  {/each}
  {#if withEmpty}<Review {...args} rating={undefined} />{/if}
</div>
