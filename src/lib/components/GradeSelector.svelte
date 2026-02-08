<script lang="ts">
	import { gradeOptions } from '$lib/constants';

	let { value = $bindable<number>(), label = 'Cote' } = $props();
</script>

<label class="label">
	<span>{label}</span>
	<select name="grade" class="select" required bind:value>
		<option value="" disabled selected>Choisir la cote</option>
		{#each gradeOptions as { label, value }}
			<option {value}>{label}</option>
		{/each}
	</select>
</label>
