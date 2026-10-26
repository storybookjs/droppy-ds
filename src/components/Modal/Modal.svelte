<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { PortalContainer } from '../../utils/container'

  export type ModalProps = {
    isOpen: boolean
    onClose: () => void
    /** Where to portal. Accepts an element or a selector; defaults to the body. */
    container?: PortalContainer
    /** Accessible name for the dialog. */
    'aria-label'?: string
    class?: string
    children?: Snippet | string
  }
</script>

<script lang="ts">
  import { Dialog } from 'bits-ui'
  import theme from '../../theme'
  import { cx } from '../../utils/cx'
  import { portalTarget } from '../../utils/container'
  import { Button } from '../Button'

  /**
   * A centred overlay on desktop, a bottom sheet on mobile.
   *
   * Bits UI's `Dialog` supplies the modal behaviour — focus trap, Escape to
   * close, outside-press dismissal, scroll lock, `aria-modal` — so this only
   * adds the shape, the motion and the close affordance.
   */
  let {
    children,
    isOpen,
    onClose,
    container,
    class: className,
    'aria-label': ariaLabel = 'dialog',
  }: ModalProps = $props()

  // Focus the popup itself rather than the close button: the dialog's content
  // is what the user asked for, and landing on "close" reads as an invitation
  // to leave. Tab still reaches the close button first.
  let popup = $state<HTMLElement | null>(null)
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
      class={cx(theme.DialogBackdrop, 'droppy-Modal-backdrop')}
      data-testid="modal-backdrop"
    />
    <Dialog.Content
      bind:ref={popup}
      data-part="root"
      tabindex={-1}
      class={cx(theme.DialogPopup, 'droppy-Modal', className)}
      data-testid="modal"
      aria-label={ariaLabel}
      onOpenAutoFocus={(event) => {
        event.preventDefault()
        popup?.focus()
      }}
    >
      <div data-part="topbar" class="droppy-Modal-topBar">
        <Button
          data-part="close"
          data-testid="modal-close-btn"
          onclick={onClose}
          clear
          round
          icon="cross"
          aria-label="close modal"
          iconSize={16}
        />
      </div>
      {#if typeof children === 'string'}{children}{:else}{@render children?.()}{/if}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
