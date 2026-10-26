<script lang="ts">
  import Body, { type BodyProps } from '../Body.svelte'

  let args: BodyProps = $props()
</script>

<Body {...args} fontWeight="regular">Regular</Body>
<Body {...args} fontWeight="medium">Medium</Body>
<Body {...args} fontWeight="bold">Bold</Body>
<Body {...args} fontWeight="black">Black</Body>
