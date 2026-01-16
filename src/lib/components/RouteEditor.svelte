<script lang="ts">
	import { enhance } from '$app/forms';
	import WallGallery from '$lib/components/WallGallery.svelte';

	let { data, form, route = $bindable({ body: [] }) } = $props();
	const isNewRoute = route.body.length === 0;
</script>

<div class="container mx-auto p-4">
	<div class="mb-6">
		<h1 class="text-3xl font-bold">
			{isNewRoute ? "Création d'un nouveau bloc" : 'Édition du bloc'}
		</h1>
		<a href="/pan/gym/{data.gym.id}" class="text-blue-600 hover:text-blue-800"> ← Back to Gym </a>
	</div>
	{#if form?.error}
		<div class="alert variant-filled-error mb-4">
			<span>{form.error}</span>
		</div>
	{/if}

	<WallGallery walls={data.gym.walls} bind:route={route.body} isEditing={true} />

	<div class="card p-6 mt-6">
		<h2 class="h3 mb-4">Route Details</h2>
		<form method="POST" use:enhance>
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
					<input
						type="text"
						name="grade"
						placeholder="e.g., 5.10a, V4"
						class="input"
						required
						value={route?.grade || ''}
					/>
				</label>
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

			<input type="hidden" name="body" value={JSON.stringify(route.body)} />

			<div class="flex gap-4">
				<button type="submit" class="btn variant-filled-primary" disabled={route.body.length === 0}>
					Save Route ({route.body.length} moves)
				</button>

				<button
					type="button"
					class="btn variant-soft"
					onclick={() => {
						route.body = [];
					}}
				>
					Clear All Moves
				</button>
			</div>
		</form>
	</div>
</div>
