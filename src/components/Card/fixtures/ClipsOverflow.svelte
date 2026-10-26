<script lang="ts">
  import Card from '../Card.svelte'

  // Takes no args; typed so it fits the story's `render` signature.
  let {}: Record<string, unknown> = $props()
</script>

<Card style="width: 16rem">
  <img src="https://placehold.co/320x180" alt="" style="display: block; width: 100%" />
</Card>
