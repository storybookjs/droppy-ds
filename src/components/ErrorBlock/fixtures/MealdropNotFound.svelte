<!-- A restaurant that isn't there. -->
<script lang="ts">
  import notFoundAnimation from '../animations/NotFound.json'
  import ErrorBlock from '../ErrorBlock.svelte'
  import AnimatedIllustration from './AnimatedIllustration.svelte'

  let {}: Record<string, unknown> = $props()
</script>

<ErrorBlock
  title="We couldn't find that restaurant."
  body="It may have closed, or the link may be out of date."
  buttonText="Back to home"
  onButtonClick={() => {}}
>
  {#snippet illustration()}<AnimatedIllustration animation={notFoundAnimation} />{/snippet}
</ErrorBlock>
