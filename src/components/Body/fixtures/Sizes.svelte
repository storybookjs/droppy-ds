<script lang="ts">
  import Body, { type BodyProps } from '../Body.svelte'

  let args: BodyProps = $props()
</script>

<Body {...args}>Base</Body>
<Body {...args} size="S">S</Body>
<Body {...args} size="XS">XS</Body>
<Body {...args} size="XXS">XXS</Body>
