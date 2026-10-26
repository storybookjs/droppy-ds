<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { PortalContainer } from '../../utils/container'

  export type ToastProviderProps = {
    /** The page content that raises toasts via `useToast`. */
    children?: Snippet
    /** Where to portal the toast stack. Accepts an element or a selector; defaults to the body. */
    container?: PortalContainer
    /** The default time (ms) before a toast auto-dismisses. `0` disables auto-dismiss. */
    timeout?: number
    /** The maximum number of toasts shown at once; older ones are marked limited rather than removed. */
    limit?: number
    class?: string
  }
</script>

<script lang="ts">
  import { Portal } from 'bits-ui'
  import theme from '../../theme'
  import { cx } from '../../utils/cx'
  import { portalTarget } from '../../utils/container'
  import { provideToastManager, ToastManager } from './manager.svelte'
  import ToastItem from './ToastItem.svelte'

  /**
   * A stack of transient, self-dismissing notifications, portaled to the corner
   * of the page.
   *
   * Toast has no trigger and no open prop of its own — a consuming app wraps
   * its tree once in this provider, then raises toasts imperatively through
   * `useToast().add(...)`. This component owns the only rendering of the toast
   * list; there is nothing else to compose by hand.
   */
  let {
    children,
    container,
    timeout = 5000,
    limit = 3,
    class: className,
  }: ToastProviderProps = $props()

  const manager = new ToastManager(() => ({ timeout }))
  provideToastManager(manager)

  let hovering = $state(false)
  let focused = $state(false)
  const expanded = $derived(hovering || focused)

  // Each toast sits above the sum of the heights in front of it.
  const offsets = $derived(
    manager.toasts.reduce<number[]>((acc, _toast, index) => {
      acc.push(index === 0 ? 0 : acc[index - 1]! + (manager.toasts[index - 1]!.height ?? 0))
      return acc
    }, [])
  )
</script>

{@render children?.()}

<Portal to={portalTarget(container)}>
  <section
    data-part="root"
    class={cx(theme.ToastViewport, 'droppy-Toast', className)}
    aria-label="Notifications"
    aria-live="polite"
    tabindex="-1"
    data-expanded={expanded ? '' : undefined}
    style:--toast-frontmost-height={manager.toasts[0]?.height
      ? `${manager.toasts[0].height}px`
      : undefined}
    onpointerenter={() => (hovering = true)}
    onpointerleave={() => (hovering = false)}
    onfocusin={() => (focused = true)}
    onfocusout={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) focused = false
    }}
  >
    {#each manager.toasts as toast, index (toast.id)}
      <ToastItem
        {toast}
        {index}
        offsetY={offsets[index] ?? 0}
        limited={index >= limit}
        {expanded}
        {manager}
      />
    {/each}
  </section>
</Portal>
