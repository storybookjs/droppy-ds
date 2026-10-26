<script module lang="ts">
  import type { SeparatorRootProps } from 'bits-ui'

  export type SeparatorProps = Omit<SeparatorRootProps, 'child' | 'children'>
</script>

<script lang="ts">
  import { Separator as BitsSeparator } from 'bits-ui'
  import theme from '../../theme'
  import { cx } from '../../utils/cx'

  /**
   * A visual and semantic divider between two blocks of content.
   *
   * Renders `role="separator"` with a matching `aria-orientation` and
   * `data-orientation`, via Bits UI's `Separator.Root`.
   */
  let { orientation = 'horizontal', class: className, ...rest }: SeparatorProps = $props()
</script>

<BitsSeparator.Root
  data-part="root"
  {orientation}
  class={cx(theme.SeparatorRoot, 'droppy-Separator', className as string)}
  {...rest}
/>
