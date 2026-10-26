<!-- A category with nothing in it. -->
<script lang="ts">
  import errorAnimation from '../animations/Error.json'
  import ErrorBlock from '../ErrorBlock.svelte'
  import AnimatedIllustration from './AnimatedIllustration.svelte'

  let {}: Record<string, unknown> = $props()
</script>

<ErrorBlock
  title="This is not the food you're looking for."
  body="No restaurants are serving sushi near you right now. Try another category."
  buttonText="Browse categories"
  onButtonClick={() => {}}
>
  {#snippet illustration()}<AnimatedIllustration animation={errorAnimation} />{/snippet}
</ErrorBlock>
