<script lang="ts">
	import { goto } from '$app/navigation';
	import { gymSchema } from '$lib/schemas/gym';
	import { createToaster } from '@skeletonlabs/skeleton-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data } = $props();

	const toastStore = createToaster();

	const { form, errors, enhance, submitting } = superForm(data.form, {
		validators: zodClient(gymSchema),
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				toastStore.success({
					description: 'Gym successfully created'
				});
				await goto('/pan/gym');
			}
		}
	});
</script>

<svelte:head>
	<title>Create New Gym</title>
</svelte:head>

<div class="container mx-auto p-4">
	<div class="mb-6">
		<h1 class="text-3xl font-bold">Create New Gym</h1>
		<a href="/pan/gym" class="text-blue-600 hover:text-blue-800"> ← Retours </a>
	</div>

	<form method="POST" use:enhance class="card p-6 max-w-md">
		<div class="mb-4">
			<label for="name" class="label">
				<span>Gym Name</span>
				<input
					type="text"
					name="name"
					bind:value={$form.name}
					class="input"
					class:input-error={$errors.name}
				/>
				{#if $errors.name}
					<span class="text-error-500 text-sm">{$errors.name}</span>
				{/if}
			</label>
		</div>

		<div class="mb-6">
			<label for="location" class="label">
				<span>Location</span>
				<input
					type="text"
					name="location"
					bind:value={$form.location}
					class="input"
					class:input-error={$errors.location}
				/>
				{#if $errors.location}
					<span class="text-error-500 text-sm">{$errors.location}</span>
				{/if}
			</label>
		</div>

		<button type="submit" class="btn preset-filled-primary-500" disabled={$submitting}>
			{$submitting ? 'Creating...' : 'Create Gym'}
		</button>
	</form>
</div>
