<script lang="ts">
  import Button, { type ButtonProps } from '../Button.svelte'

  let args: ButtonProps = $props()
</script>

<div style="display: flex; gap: 1rem; align-items: center">
  <Button {...args} icon="cart" />
  <Button {...args} icon="cart" iconSize={32} />
</div>
