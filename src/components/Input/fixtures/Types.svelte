<script lang="ts">
  import Input, { type InputProps } from '../Input.svelte'

  let args: InputProps = $props()
</script>

<Input {...args} label="Email" type="email" />
<Input {...args} label="Phone" type="tel" />
<Input {...args} label="Postcode" />
