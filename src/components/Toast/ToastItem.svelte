<script lang="ts">
  import theme from '../../theme'
  import type { ToastManager, ToastObject } from './manager.svelte'

  let {
    toast,
    index,
    offsetY,
    limited,
    expanded,
    manager,
  }: {
    toast: ToastObject
    index: number
    offsetY: number
    limited: boolean
    expanded: boolean
    manager: ToastManager
  } = $props()

  let root = $state<HTMLElement | null>(null)

  // Measure the natural height once the content is in, and again whenever the
  // title or description change (a promise toast resolving, say).
  $effect(() => {
    void toast.title
    void toast.description
    if (!root) return
    const previous = root.style.height
    root.style.height = 'auto'
    const height = root.offsetHeight
    root.style.height = previous
    if (height !== toast.height) manager.measure(toast.id, height)
  })
</script>

<div
  bind:this={root}
  data-part="toast"
  class={theme.ToastRoot}
  role="dialog"
  aria-modal="false"
  aria-labelledby={toast.title ? `${toast.id}-title` : undefined}
  aria-describedby={toast.description ? `${toast.id}-description` : undefined}
  tabindex="0"
  data-type={toast.type}
  data-expanded={expanded ? '' : undefined}
  data-limited={limited ? '' : undefined}
  data-starting-style={toast.transitionStatus === 'starting' ? '' : undefined}
  data-ending-style={toast.transitionStatus === 'ending' ? '' : undefined}
  style:--toast-index={index}
  style:--toast-offset-y="{offsetY}px"
  style:--toast-height="{toast.height ?? 0}px"
  style:--toast-swipe-movement-x="0px"
  style:--toast-swipe-movement-y="0px"
>
  <div
    data-part="content"
    class={theme.ToastContent}
    data-behind={index > 0 && !expanded ? '' : undefined}
    data-expanded={expanded ? '' : undefined}
  >
    <div class={theme.ToastText}>
      {#if toast.title}
        <h2 id="{toast.id}-title" data-part="title" class={theme.ToastTitle}>{toast.title}</h2>
      {/if}
      {#if toast.description}
        <p id="{toast.id}-description" data-part="description" class={theme.ToastDescription}>
          {toast.description}
        </p>
      {/if}
    </div>
    <button
      type="button"
      data-part="close"
      class={theme.ToastClose}
      aria-hidden={expanded ? undefined : 'true'}
      tabindex={expanded ? undefined : -1}
      onclick={() => manager.close(toast.id)}
    >
      Dismiss
    </button>
  </div>
</div>
