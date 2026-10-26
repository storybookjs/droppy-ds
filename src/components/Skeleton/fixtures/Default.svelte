<script lang="ts">
  import Skeleton, { type SkeletonProps } from '../Skeleton.svelte'

  let args: SkeletonProps = $props()
</script>

<p style="margin: 0; font-size: 1.5rem"><Skeleton {...args} /></p>
