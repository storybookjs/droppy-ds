<script lang="ts">
  import { Button } from '../../Button'
  import { useToast } from '../manager.svelte'

  let {}: Record<string, unknown> = $props()

  const toast = useToast()
</script>

<div style="display: flex; gap: 1rem; padding: 1rem">
  <Button
    icon="cart"
    onclick={() =>
      toast.add({ title: 'Added to your order', description: 'Cheeseburger ×2 — €17.00' })}
  >
    Add to cart
  </Button>
  <Button
    clear
    onclick={() =>
      toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
        loading: { title: 'Saving menu…' },
        success: { title: 'Menu saved', description: 'Diners see the new prices now.' },
        error: { title: "Couldn't save the menu", description: 'Check your connection.' },
      })}
  >
    Save menu
  </Button>
</div>
