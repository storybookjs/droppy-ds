<script lang="ts">
  import Review, { type ReviewProps } from '../Review.svelte'

  let args: ReviewProps = $props()
</script>

<Review {...args} />

<style>
  :global(.review-demo-inset) {
    margin: 1rem;
  }
</style>
