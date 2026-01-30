<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_UPLOAD_URL } from '$env/static/public';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let deletingWallId = $state<number | null>(null);

	function confirmDelete(wallId: number, wallName: string) {
		if (confirm(`Are you sure you want to delete "${wallName}"? This action cannot be undone.`)) {
			deletingWallId = wallId;
			return true;
		}
		return false;
	}
</script>

<div class="container mx-auto p-4 space-y-4">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a href="/pan/gym/{data.gym.id}" class="btn preset-tonal">← Back to Gym</a>
			<div>
				<h1 class="h1">{data.gym.name} - Walls</h1>
			</div>
		</div>
		<a href="/pan/gym/{data.gym.id}/walls/new" class="btn preset-filled-primary-500"> Add New Wall </a>
	</div>

	{#if data.walls.length === 0}
		<div class="card p-8 text-center">
			<h2 class="h2 mb-4">No walls found</h2>
			<p class="mb-4">Start by adding your first climbing wall for {data.gym.name}.</p>
			<a href="/pan/gym/{data.gym.id}/walls/new" class="btn preset-filled-primary-500"> Add Wall </a>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each data.walls as wall}
				<div class="card">
					{#if wall.photo}
						<header class="card-header">
							<img
								src="{PUBLIC_UPLOAD_URL}/{wall.photo.file_path}"
								alt={wall.name}
								class="w-full h-48 object-cover rounded-t-container-token"
							/>
						</header>
					{/if}

					<section class="p-4">
						<h3 class="h3 mb-2">{wall.name}</h3>
						{#if wall.description}
							<p class="text-sm opacity-75 mb-2">{wall.description}</p>
						{/if}
						<div class="flex justify-between items-center text-xs opacity-50">
							<span>Added {new Date(wall.created_at).toLocaleDateString()}</span>
						</div>
					</section>

					<footer class="card-footer">
						<div class="flex gap-2">
							<a
								href="/pan/gym/{data.gym.id}/walls/{wall.id}"
								class="btn preset-tonal-primary flex-1"
							>
								View Details
							</a>
							<a
								href="/pan/gym/{data.gym.id}/walls/{wall.id}/edit"
								class="btn preset-tonal-secondary"
							>
								Edit
							</a>
							<form
								method="POST"
								action="?/delete"
								use:enhance={() => {
									if (!confirmDelete(wall.id, wall.name)) {
										return ({ cancel }) => cancel();
									}
									deletingWallId = wall.id;
									return async ({ update }) => {
										await update();
										deletingWallId = null;
									};
								}}
							>
								<input type="hidden" name="wallId" value={wall.id} />
								<button
									type="submit"
									class="btn preset-tonal-error"
									disabled={deletingWallId === wall.id}
								>
									{deletingWallId === wall.id ? 'Deleting...' : 'Delete'}
								</button>
							</form>
						</div>
					</footer>
				</div>
			{/each}
		</div>
	{/if}
</div>
