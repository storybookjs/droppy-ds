<!-- Rendered open and with no trigger, so the panel scans the dialog's own
     parts rather than the button that would have opened it. -->
<script lang="ts">
  import Modal, { type ModalProps } from '../Modal.svelte'
  import RemoveFromCartBody from './RemoveFromCartBody.svelte'

  let { onClose: _onClose, children: _children, ...args }: ModalProps = $props()
</script>

<Modal {...args} onClose={() => {}}>
  <RemoveFromCartBody />
</Modal>
