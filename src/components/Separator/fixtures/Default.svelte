<script lang="ts">
  import Separator, { type SeparatorProps } from '../Separator.svelte'

  let args: SeparatorProps = $props()
</script>

<div
  style:display="flex"
  style:flex-direction={args.orientation === 'vertical' ? 'row' : 'column'}
  style:align-items={args.orientation === 'vertical' ? 'center' : undefined}
  style:gap="1rem"
  style:height={args.orientation === 'vertical' ? '2rem' : undefined}
>
  <span>Section one</span>
  <Separator {...args} />
  <span>Section two</span>
</div>
