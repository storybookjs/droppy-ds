<!-- DropBoard's menu-photo uploader, determinate then indeterminate. -->
<script lang="ts">
  import { Body } from '../../Body'
  import { Card } from '../../Card'
  import { Heading } from '../../Heading'
  import Progress from '../Progress.svelte'

  let {}: Record<string, unknown> = $props()
</script>

<Card padded style="max-width: 28rem">
  <Heading level={3} size={4}>Menu photos</Heading>

  <div style="display: grid; gap: 2rem; margin-top: 1.5rem">
    <div style="display: grid; gap: 0.5rem">
      <Progress value={37} label="Uploading 3 of 8 photos" showValue />
      <Body size="XXS">Bytes in flight — the browser knows the total.</Body>
    </div>

    <div style="display: grid; gap: 0.5rem">
      <Progress value={null} label="Processing images" />
      <Body size="XXS">The server owns this step, and will not say how long it has left.</Body>
    </div>
  </div>
</Card>
