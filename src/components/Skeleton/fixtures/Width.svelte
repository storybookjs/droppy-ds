<script lang="ts">
  import Skeleton, { type SkeletonProps } from '../Skeleton.svelte'

  let args: SkeletonProps = $props()
</script>

<div style="display: grid; gap: 0.5rem; max-width: 320px">
  <Skeleton {...args} width="100%" />
  <Skeleton {...args} width="60%" />
  <Skeleton {...args} width={120} />
</div>
