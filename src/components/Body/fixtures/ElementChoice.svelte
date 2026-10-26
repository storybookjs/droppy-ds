<script lang="ts">
  import Body, { type BodyProps } from '../Body.svelte'

  let args: BodyProps = $props()
</script>

<Body {...args} type="p">p</Body>
<Body {...args} type="span">span</Body>
<Body {...args} type="label">label</Body>
<Body {...args} type="figcaption">figcaption</Body>
