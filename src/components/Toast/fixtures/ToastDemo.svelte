<!--
  Story harness: a ToastProvider around a "Save draft" button. A `.stories.ts`
  arg can't hold a snippet that reads the provider's context, so `buttonLabel`
  stands in for `children`. `hostId` renders a portal target first, and
  `raiseOnMount` swaps the button for a toast raised immediately.
-->
<script lang="ts">
  import ToastProvider, { type ToastProviderProps } from '../ToastProvider.svelte'
  import CreateToastButton from './CreateToastButton.svelte'
  import RaiseOnMount from './RaiseOnMount.svelte'

  let {
    children: _children,
    buttonLabel,
    hostId,
    hostTestId,
    raiseOnMount = false,
    ...args
  }: ToastProviderProps & {
    buttonLabel?: string
    hostId?: string
    hostTestId?: string
    raiseOnMount?: boolean
  } = $props()
</script>

{#if hostId}<div id={hostId} data-testid={hostTestId}></div>{/if}
<ToastProvider {...args}>
  {#if raiseOnMount}
    <RaiseOnMount />
  {:else}
    <CreateToastButton label={buttonLabel} />
  {/if}
</ToastProvider>

<style>
  :global(.toast-demo-inset) {
    margin: 1rem;
  }
</style>
