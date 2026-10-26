<script lang="ts">
  import Skeleton, { type SkeletonProps } from '../Skeleton.svelte'

  let args: SkeletonProps = $props()
</script>

<div style="max-width: 320px"><Skeleton {...args} /></div>
