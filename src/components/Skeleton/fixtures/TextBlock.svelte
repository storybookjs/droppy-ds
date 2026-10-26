<script lang="ts">
  import { Heading } from '../../Heading'
  import Skeleton, { type SkeletonProps } from '../Skeleton.svelte'

  let args: SkeletonProps = $props()
</script>

<div role="status" aria-label="Loading restaurant details" style="max-width: 320px">
  <div aria-hidden="true">
    <Heading level={2}><Skeleton {...args} width="50%" /></Heading>
    <p style="margin: 0.5rem 0"><Skeleton {...args} width="35%" /></p>
    <p style="margin: 0.5rem 0"><Skeleton {...args} /></p>
    <p style="margin: 0">
      <Skeleton {...args} width="25%" height="23px" style="margin-top: 24px" />
    </p>
  </div>
</div>
