<script lang="ts">
  import { Button } from '../../Button'
  import { useToast } from '../manager.svelte'

  let { label = 'Save draft' }: { label?: string } = $props()

  const toast = useToast()
</script>

<Button
  onclick={() =>
    toast.add({ title: 'Draft saved', description: 'Your changes are stored automatically.' })}
>
  {label}
</Button>
