<script lang="ts">
  import type { ModalProps } from '../Modal.svelte'
  import ModalDemo from './ModalDemo.svelte'

  let args: ModalProps = $props()
</script>

<div id="modal-portal-test" data-testid="portal-host"></div>
<ModalDemo {...args} />
