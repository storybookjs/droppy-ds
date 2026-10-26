<script lang="ts">
  import Button, { type ButtonProps } from '../Button.svelte'

  let args: ButtonProps = $props()
</script>

<div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center">
  <Button {...args}>Default</Button>
  <Button {...args} large>Large</Button>
  <Button {...args} clear>Clear</Button>
  <Button {...args} icon="cart">With icon</Button>
  <Button {...args} icon="cross" round clear aria-label="close" children={undefined} />
  <Button {...args} disabled>Disabled</Button>
</div>
