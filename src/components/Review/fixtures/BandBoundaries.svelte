<script lang="ts">
  import Review from '../Review.svelte'

  let {}: Record<string, unknown> = $props()
</script>

<Review rating={1.9} />
<Review rating={2} />
<Review rating={3.9} />
<Review rating={4} />
<Review rating={5} />
