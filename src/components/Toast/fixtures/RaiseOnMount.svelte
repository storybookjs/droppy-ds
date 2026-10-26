<!-- Raises one toast as soon as it mounts, for stories that should show the
     notification rather than the control that produces it. -->
<script lang="ts">
  import { onMount } from 'svelte'
  import { useToast } from '../manager.svelte'

  let {}: Record<string, unknown> = $props()

  const toast = useToast()

  onMount(() => {
    toast.add({ title: 'Draft saved', description: 'Your changes are stored automatically.' })
  })
</script>
