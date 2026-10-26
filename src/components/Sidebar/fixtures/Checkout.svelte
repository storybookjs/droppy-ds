<script lang="ts">
  import { Button } from '../../Button'

  let { total }: { total: string } = $props()
</script>

<div style="display: flex; flex-direction: column; gap: 1rem; width: 100%">
  <strong>Total — {total}</strong>
  <Button large icon="arrow-right">Go to checkout</Button>
</div>
