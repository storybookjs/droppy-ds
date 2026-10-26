<script lang="ts">
  import Skeleton, { type SkeletonProps } from '../Skeleton.svelte'

  let args: SkeletonProps = $props()
</script>

<div style="display: grid; gap: 0.5rem; max-width: 320px">
  <Skeleton {...args} height="1em" />
  <Skeleton {...args} height={40} />
  <Skeleton {...args} height="6rem" />
</div>
