<script lang="ts">
  import { Heading } from '../../Heading'
  import Input from '../Input.svelte'

  // Story args are accepted (and ignored) so the fixture fits `render`'s type.
  let {}: Record<string, unknown> = $props()
</script>

<form style="display: grid; gap: 1.5rem; max-width: 30rem">
  <section style="display: grid; gap: 0.5rem">
    <Heading level={3} size={4}>Contact details</Heading>
    <Input label="Name" value="Ada Lovelace" />
    <Input label="Email" value="ada@example" error="Enter a valid email address." />
    <Input label="Phone" value="06 12345678" />
  </section>

  <section style="display: grid; gap: 0.5rem">
    <Heading level={3} size={4}>Delivery details</Heading>
    <Input label="Address" value="Staalstraat 12" />
    <Input label="Postcode" value="1011" error="A Dutch postcode looks like 1011 JL." />
    <Input label="City" value="Amsterdam" />
  </section>
</form>
