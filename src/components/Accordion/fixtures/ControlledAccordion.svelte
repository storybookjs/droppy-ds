<script lang="ts">
  import { Body } from '../../Body'
  import Accordion, { type AccordionProps } from '../Accordion.svelte'

  let { onValueChange, ...args }: AccordionProps = $props()

  let value = $state<string[]>(['delivery-time'])
</script>

<div style="display: flex; flex-direction: column; gap: 0.75rem">
  <Accordion
    {...args}
    {value}
    onValueChange={(next) => {
      value = next
      onValueChange?.(next)
    }}
  />
  <Body size="XS">Open: {value.length > 0 ? value.join(', ') : 'none'}</Body>
</div>
