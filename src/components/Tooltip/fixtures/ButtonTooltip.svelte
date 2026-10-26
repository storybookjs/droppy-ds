<!--
  Story harness: a Tooltip whose trigger is a round, clear icon Button. Plain
  CSF args can't hold a snippet with parameters, so the trigger is described
  by `trigger` (Button props) and built here.
-->
<script lang="ts">
  import { Button, type ButtonProps } from '../../Button'
  import Tooltip, { type TooltipProps } from '../Tooltip.svelte'

  let {
    trigger = { icon: 'moon', 'aria-label': 'turn on dark mode' },
    children: _children,
    ...args
  }: Partial<TooltipProps> & { trigger?: ButtonProps } = $props()
</script>

<Tooltip label="" {...args}>
  {#snippet children({ props })}
    <Button round clear {...trigger} {...props} />
  {/snippet}
</Tooltip>
