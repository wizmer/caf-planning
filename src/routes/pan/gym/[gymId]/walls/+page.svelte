<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="container mx-auto p-4 space-y-4">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a href="/pan/gym" class="btn variant-soft">← Back to Gyms</a>
			<div>
				<h1 class="h1">{data.gym.name} - Walls</h1>
			</div>
		</div>
		<a href="/pan/gym/{data.gym.id}/walls/new" class="btn variant-filled-primary"> Add New Wall </a>
	</div>

	{#if data.walls.length === 0}
		<div class="card p-8 text-center">
			<h2 class="h2 mb-4">No walls found</h2>
			<p class="mb-4">Start by adding your first climbing wall for {data.gym.name}.</p>
			<a href="/pan/gym/{data.gym.id}/walls/new" class="btn variant-filled-primary"> Add Wall </a>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each data.walls as wall}
				<div class="card">
					{#if wall.photo}
						<header class="card-header">
							<img
								src="/uploads/{wall.photo.file_path}"
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
								class="btn variant-soft-primary flex-1"
							>
								View Details
							</a>
							<a
								href="/pan/gym/{data.gym.id}/walls/{wall.id}/edit"
								class="btn variant-soft-secondary"
							>
								Edit
							</a>
						</div>
					</footer>
				</div>
			{/each}
		</div>
	{/if}
</div>
