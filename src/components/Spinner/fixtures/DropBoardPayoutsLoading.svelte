<!-- DropBoard's payouts panel while the figures load. -->
<script lang="ts">
  import { Card } from '../../Card'
  import { Heading } from '../../Heading'
  import Spinner from '../Spinner.svelte'

  let {}: Record<string, unknown> = $props()
</script>

<Card padded style="width: 20rem">
  <Heading level={3} size={4}>Payouts</Heading>
  <div style="display: grid; place-items: center; min-height: 10rem">
    <Spinner label="Loading payouts" />
  </div>
</Card>
