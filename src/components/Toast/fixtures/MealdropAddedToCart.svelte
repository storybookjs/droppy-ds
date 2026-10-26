<!-- Adding to a cart, and saving a menu. -->
<script lang="ts">
  import type { PortalContainer } from '../../../utils/container'
  import ToastProvider from '../ToastProvider.svelte'
  import MealdropButtons from './MealdropButtons.svelte'

  let props: { container?: PortalContainer } & Record<string, unknown> = $props()
</script>

<ToastProvider container={props.container}>
  <MealdropButtons />
</ToastProvider>
