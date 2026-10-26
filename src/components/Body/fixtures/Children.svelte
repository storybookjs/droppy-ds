<script lang="ts">
  import Body, { type BodyProps } from '../Body.svelte'

  let { children: _children, ...args }: BodyProps = $props()
</script>

<Body {...args}>Delivery is <strong>free</strong> over €20 — <em>today only</em>.</Body>
