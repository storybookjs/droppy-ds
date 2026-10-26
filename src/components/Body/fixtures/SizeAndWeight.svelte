<script lang="ts">
  import Body from '../Body.svelte'

  // Takes no args; typed so it fits the story's `render` signature.
  let {}: Record<string, unknown> = $props()
</script>

<Body size="XS">Small regular</Body>
<Body size="XS" fontWeight="bold">Small bold</Body>
