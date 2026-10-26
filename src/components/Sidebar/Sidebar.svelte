<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { PortalContainer } from '../../utils/container'
  import type { TextOrSnippet } from '../../utils/text'

  export type SidebarProps = {
    isOpen: boolean
    /** Heading shown in the top bar. Also names the dialog. */
    title: string
    onClose: () => void
    /** Pinned to the bottom of the panel — for totals and primary actions. */
    footer?: Snippet | string
    /** Where to portal. Accepts an element or a selector; defaults to the body. */
    container?: PortalContainer
    class?: string
    children?: TextOrSnippet
  }
</script>

<script lang="ts">
  import { Dialog } from 'bits-ui'
  import theme from '../../theme'
  import { cx } from '../../utils/cx'
  import { portalTarget } from '../../utils/container'
  import { Button } from '../Button'
  import { Heading } from '../Heading'

  /**
   * A panel that slides in from the trailing edge — for carts, filters, and
   * anything reviewed alongside the page rather than instead of it.
   *
   * Bits UI's `Dialog` supplies Escape-to-close, outside-press dismissal, the
   * focus trap and the scroll lock. (Base UI's swipe-to-dismiss has no Bits UI
   * equivalent and was not ported.)
   */
  let {
    children,
    footer,
    isOpen,
    title,
    onClose,
    container,
    class: className,
  }: SidebarProps = $props()
</script>

<Dialog.Root
  open={isOpen}
  onOpenChange={(open) => {
    if (!open) onClose()
  }}
>
  <Dialog.Portal to={portalTarget(container)}>
    <Dialog.Overlay
      data-part="backdrop"
      class={cx(theme.DrawerBackdrop, 'droppy-Sidebar-backdrop')}
      data-testid="sidebar-backdrop"
    />
    <div class="droppy-Sidebar-viewport">
      <Dialog.Content
        data-part="root"
        class={cx(theme.DrawerPopup, 'droppy-Sidebar', className)}
        data-testid="sidebar"
      >
        <div data-part="topbar" class="droppy-Sidebar-topBar">
          <Dialog.Title data-part="title" class={theme.DrawerTitle}>
            {#snippet child({ props })}
              <Heading level={4} {...props}>{title}</Heading>
            {/snippet}
          </Dialog.Title>
          <Button
            data-part="close"
            aria-label="close sidebar"
            data-testid="sidebar-close-btn"
            onclick={onClose}
            clear
            round
            icon="cross"
            iconSize={16}
          />
        </div>
        <div data-part="content" class="droppy-Sidebar-content" data-testid="sidebar-content">
          {#if typeof children === 'string'}{children}{:else}{@render children?.()}{/if}
        </div>
        {#if footer}
          <div data-part="footer" class="droppy-Sidebar-footer" data-testid="sidebar-footer">
            {#if typeof footer === 'string'}{footer}{:else}{@render footer()}{/if}
          </div>
        {/if}
      </Dialog.Content>
    </div>
  </Dialog.Portal>
</Dialog.Root>
