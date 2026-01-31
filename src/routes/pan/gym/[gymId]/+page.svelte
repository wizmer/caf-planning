<script lang="ts">
	import RouteThumbnail from '$lib/components/RouteThumbnail.svelte';
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

{#snippet AddWallButton()}
	<a
		href="/pan/gym/{gym.id}/walls/new"
		class="mb-4 inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
	>
		Ajouter un mur
	</a>
{/snippet}

<div class="container mx-auto p-4">
	<div class="mb-6">
		<h1 class="h1 font-bold">{gym.name}</h1>
		<p class="text-gray-600 mt-2">
			{gym.routes.length} bloc{gym.routes.length !== 1 ? 's' : ''} disponible
		</p>
	</div>

	{#if gym.walls.length === 0}
		<div class="h1">Aucun mur défini</div>
		<div class="text-lg text-primary-500 mt-4">
			<p>
				Cet espace de bloc n'a pas encore de murs définis. Veuillez ajouter des murs pour pouvoir
				créer des blocs.
			</p>
			{@render AddWallButton()}
		</div>
	{:else}
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
					<div class="bg-white rounded-lg shadow-md p-6 border h-96 flex flex-col">
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

						<div class="flex-1 min-h-0">
							<a href="/pan/gym/{gym.id}/route/{route.id}" class="block h-full">
								<RouteThumbnail walls={gym.walls} route={route.body} legend={false} />
							</a>
						</div>

						<div class="mt-4 flex justify-between items-center text-sm text-gray-500">
							<span>Created: {new Date(route.created_at).toLocaleDateString()}</span>
							<a
								href="/pan/gym/{gym.id}/route/{route.id}"
								class="text-blue-600 hover:text-blue-800"
							>
								View Details
							</a>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<h2 class="h2 mt-8">Gallerie des murs</h2>
		{@render AddWallButton()}

		<!-- Edit walls butto -->
		<a
			href="/pan/gym/{gym.id}/walls"
			class="mb-4 ml-4 inline-block bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
		>
			Éditer les murs
		</a>

		<div class="h-96">
			<WallGallery id={gym.id} walls={gym.walls} legend={false} />
		</div>
	{/if}
</div>

<style>
	h2 {
		margin-bottom: 20px;
	}
</style>
