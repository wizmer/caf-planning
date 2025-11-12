<script lang="ts">
	import { routes } from '../../routes';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="container mx-auto p-4 space-y-4">
	<div class="flex justify-between items-center">
		<h1 class="h1">Bouldering Gyms</h1>
		<a href={routes.newGym} class="btn variant-filled-primary"> Add New Gym </a>
	</div>

	{#if data.gyms.length === 0}
		<div class="card p-8 text-center">
			<h2 class="h2 mb-4">No gyms found</h2>
			<p class="mb-4">Start by adding your first bouldering gym.</p>
			<a href={routes.newGym} class="btn variant-filled-primary"> Add Gym </a>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each data.gyms as gym}
				<div class="card">
					<section class="p-4">
						<h3 class="h3 mb-2">{gym.name}</h3>

						{#if gym.description}
							<p class="text-sm opacity-75 mb-2">{gym.description}</p>
						{/if}

						<div class="flex justify-between items-center text-xs opacity-50">
							<span>Added {new Date(gym.created_at).toLocaleDateString()}</span>
						</div>
					</section>

					<footer class="card-footer">
						<div class="flex flex-col gap-2">
							<div class="flex gap-2">
								<a href="/pan/gym/{gym.id}/walls" class="btn variant-soft-primary flex-1">
									View Walls
								</a>
								<a href="/pan/gym/{gym.id}/edit" class="btn variant-soft-secondary"> Edit </a>
							</div>
							<div class="flex gap-2">
								<a href="/pan/gym/{gym.id}/routes" class="btn variant-soft-primary flex-1">
									View Routes
								</a>
							</div>
						</div>
					</footer>
				</div>
			{/each}
		</div>
	{/if}
</div>
