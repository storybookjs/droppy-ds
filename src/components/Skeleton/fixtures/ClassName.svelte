<script lang="ts">
  import Skeleton, { type SkeletonProps } from '../Skeleton.svelte'

  let args: SkeletonProps = $props()
</script>

<Skeleton {...args} />

<style>
  :global(.skeleton-demo-inset) {
    margin: 1rem;
  }
</style>
