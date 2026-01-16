<script lang="ts">
	import WallGallery from '$lib/components/WallGallery.svelte';
	import { type PageData } from '../$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const { gym } = data;
</script>

<svelte:head>
	<title>Liste des blocs - {gym.name}</title>
</svelte:head>

<div class="container mx-auto p-4">
	<div class="mb-6">
		<h1 class="h1 font-bold">{gym.name}</h1>
		<p class="text-gray-600 mt-2">
			{gym.routes.length} bloc{gym.routes.length !== 1 ? 's' : ''} disponible
		</p>
	</div>

	<h2 class="h2">Liste des blocs</h2>

	{#if gym.routes.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-500 text-lg">No routes found for this gym.</p>
			<a
				href="/pan/gym/{gym.id}/route/new"
				class="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>
				Ajouter un bloc
			</a>
		</div>
	{:else}
		<div class="mb-4">
			<a
				href="/pan/gym/{gym.id}/route/new"
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>
				Ajouter un bloc
			</a>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each gym.routes as route}
				<div class="bg-white rounded-lg shadow-md p-6 border">
					<div class="flex justify-between items-start mb-3">
						<h3 class="text-xl font-semibold">{route.name}</h3>
						<span class="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
							{route.grade}
						</span>
					</div>

					<p class="text-sm text-gray-500 mb-2">Wall: {route.name}</p>

					{#if route.description}
						<p class="text-gray-700 mb-4">{route.description}</p>
					{/if}

					<WallGallery id={gym.id} walls={gym.walls} route={route.body} showLegend={false} />

					<div class="mt-4 flex justify-between items-center text-sm text-gray-500">
						<span>Created: {new Date(route.created_at).toLocaleDateString()}</span>
						<a href="/pan/gym/{gym.id}/route/{route.id}" class="text-blue-600 hover:text-blue-800">
							View Details
						</a>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<h2 class="h2">Murs</h2>
	<WallGallery id={gym.id} walls={gym.walls} />
</div>

<style>
	h2 {
		margin-bottom: 20px;
	}
</style>
