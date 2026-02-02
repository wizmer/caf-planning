<script lang="ts">
	import { enhance } from '$app/forms';
	import RouteViewer from '$lib/components/RouteViewer.svelte';

	let { data, form, moves = $bindable([]) } = $props();
	const isNewRoute = moves.length === 0;

	const grades = [
		'4c',
		'4c+',
		'5a',
		'5a+',
		'5b',
		'5b+',
		'5c',
		'5c+',
		'6a',
		'6a+',
		'6b',
		'6b+',
		'6c',
		'6c+',
		'7a',
		'7a+',
		'7b',
		'7b+',
		'7c',
		'7c+',
		'8a',
		'8a+',
		'8b',
		'8b+',
		'8c',
		'8c+',
		'9a'
	];
</script>

<div class="mb-6">
	<h1 class="text-3xl font-bold">
		{isNewRoute ? "Création d'un nouveau bloc" : 'Édition du bloc'}
	</h1>
	<a href="/pan/gym/{data.gym.id}" class="text-blue-600 hover:text-blue-800"> ← Retour </a>
</div>
{#if form?.error}
	<div class="alert preset-filled-error-500 mb-4">
		<span>{form.error}</span>
	</div>
{/if}

<RouteViewer walls={data.gym.walls} bind:moves isEditing={true} />

<div class="card p-6 mt-6">
	<h2 class="h3 mb-4">Route Details</h2>
	<form method="POST" use:enhance action="?/save">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
			<label class="label">
				<span>Route Name *</span>
				<input
					type="text"
					name="name"
					placeholder="e.g., Crimpy Goodness"
					class="input"
					required
					value={route?.name || ''}
				/>
			</label>

			<label class="label">
				<span>Grade *</span>
				<select name="grade" class="input" required value={route?.grade || ''}>
					<option value="" disabled selected>Choisir la cote</option>
					{#each grades as grade}
						<option value={grade}>{grade}</option>
					{/each}
				</select></label
			>
		</div>

		<label class="label mb-4">
			<span>Description</span>
			<textarea
				name="routeDescription"
				placeholder="Describe the route, tips, or any special notes..."
				class="textarea"
				rows="3"
				value={route?.routeDescription || ''}
			></textarea>
		</label>

		<input type="hidden" name="moves" value={JSON.stringify(moves)} />

		<div class="flex gap-4">
			<button type="submit" class="btn preset-filled-primary-500" disabled={moves.length === 0}>
				Enregistrer le bloc ({moves.length} mouvements)
			</button>

			<button
				type="button"
				class="btn preset-tonal"
				onclick={() => {
					moves = [];
				}}
			>
				Enlever tous les mouvements
			</button>
		</div>
	</form>
</div>
