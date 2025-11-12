<script lang="ts">
	import GymForm from '$lib/components/GymForm.svelte';
	import type { ActionData } from './$types';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
</script>

<div class="container mx-auto p-4 space-y-4 max-w-2xl">
	<div class="flex items-center gap-4 mb-6">
		<a href="/pan/gym" class="btn variant-soft">← Back to Gyms</a>
		<h1 class="h1">Add New Gym</h1>
	</div>

	<GymForm {form} />
</div>
