<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<button class="items-center gap-2 inline-flex" on:click>
	<Icon icon="mdi-light:arrow-left" width="40px" color="rgb(82 82 91)" />
	<div class="text-neutral-500 text-sm font-medium font-['General Sans'] leading-tight">
		<slot>BACK</slot>
	</div>
</button>
