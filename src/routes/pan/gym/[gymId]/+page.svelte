<script lang="ts">
	import RouteThumbnail from '$lib/components/RouteThumbnail.svelte';
	import WallGalery from '$lib/components/WallGalery.svelte';
	import { gradeOptions, gradeToIndex } from '$lib/constants';
	import { SearchIcon, XIcon } from '@lucide/svelte';
	import type { LayoutData } from './$types';

	interface Props {
		data: LayoutData;
	}

	let { data }: Props = $props();

	const gym = $derived(data.gym);
	let searchQuery = $state('');
	let minGrade = $state<number | undefined>(undefined);
	let maxGrade = $state<number | undefined>(undefined);

	// Auto-adjust grade ranges to prevent invalid combinations
	$effect(() => {
		if (minGrade !== undefined && maxGrade !== undefined && minGrade > maxGrade) {
			maxGrade = minGrade;
		}
	});

	// Computed values - filter routes based on search and grade criteria
	const filteredRoutes = $derived(
		gym.routes.filter((route) => {
			const matchesSearch =
				route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(route.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
			const matchesMinGrade = minGrade === undefined || gradeToIndex(route.grade) >= minGrade;
			const matchesMaxGrade = maxGrade === undefined || gradeToIndex(route.grade) <= maxGrade;
			return matchesSearch && matchesMinGrade && matchesMaxGrade;
		})
	);
	const hasActiveFilters = $derived(
		searchQuery !== '' || minGrade !== undefined || maxGrade !== undefined
	);
	const activeFilterCount = $derived(
		(searchQuery !== '' ? 1 : 0) +
			(minGrade !== undefined ? 1 : 0) +
			(maxGrade !== undefined ? 1 : 0)
	);

	// Clear all filters
	function clearFilters() {
		searchQuery = '';
		minGrade = undefined;
		maxGrade = undefined;
	}
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

		<!-- Search & Filters -->
		<div class="mb-6">
			<div class="flex items-center justify-between mb-4">
				<div class="flex items-center gap-3">
					<h3 class="text-lg font-semibold">Filtres</h3>
					{#if hasActiveFilters}
						<span class="chip preset-filled-secondary-500">
							{activeFilterCount} actif{activeFilterCount > 1 ? 's' : ''}
						</span>
					{/if}
				</div>
				{#if hasActiveFilters}
					<button onclick={clearFilters} class="btn preset-tonal text-sm flex items-center gap-1">
						<XIcon size={14} />
						Effacer les filtres
					</button>
				{/if}
			</div>

			<form class="w-full space-y-4">
				<!-- Search -->
				<div class="input-group grid-cols-[auto_1fr]">
					<div class="ig-cell preset-tonal">
						<SearchIcon size={16} />
					</div>
					<input
						class="ig-input"
						bind:value={searchQuery}
						type="search"
						placeholder="Rechercher par nom ou description..."
					/>
				</div>

				<!-- Grade Range -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="input-group grid-cols-[auto_1fr]">
						<div class="ig-cell preset-tonal">
							<span class="text-sm">Cote Min</span>
						</div>
						<select name="min-grade" class="ig-select p-2" bind:value={minGrade}>
							<option value={undefined}>Toutes</option>
							{#each gradeOptions as { label, value }}
								<option {value}>{label}</option>
							{/each}
						</select>
					</div>

					<div class="input-group grid-cols-[auto_1fr]">
						<div class="ig-cell preset-tonal">
							<span class="text-sm">Cote Max</span>
						</div>
						<select name="max-grade" class="ig-select p-2" bind:value={maxGrade}>
							<option value={undefined}>Toutes</option>
							{#each gradeOptions as { label, value }}
								<option {value}>{label}</option>
							{/each}
						</select>
					</div>
				</div>
			</form>
		</div>

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
			<!-- Result count and actions -->
			<div class="mb-4 flex items-center justify-between">
				<p class="text-gray-600">
					{filteredRoutes.length} bloc{filteredRoutes.length !== 1 ? 's' : ''} trouvé{filteredRoutes.length !==
					1
						? 's'
						: ''}
					{#if hasActiveFilters && filteredRoutes.length !== gym.routes.length}
						<span class="text-gray-400">sur {gym.routes.length}</span>
					{/if}
				</p>
				<a
					href="/pan/gym/{gym.id}/route/new"
					class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded"
				>
					Ajouter un bloc
				</a>
			</div>

			{#if filteredRoutes.length === 0}
				<div class="text-center py-12 bg-gray-50 rounded-lg">
					<p class="text-gray-500 text-lg mb-2">Aucun bloc ne correspond à vos critères</p>
					<p class="text-gray-400 text-sm">Essayez d'ajuster vos filtres</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each filteredRoutes as route}
						{@const walls = gym.walls.filter((wall) =>
							route.moves.some((move) => move.wallId === wall.id)
						)}
						<div class="bg-white rounded-lg shadow-md p-6 border h-96 flex flex-col">
							<div class="flex justify-between items-start mb-3">
								<h3 class="text-xl font-semibold">{route.name}</h3>
								<span class="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
									{route.grade}
								</span>
							</div>

							<p class="text-sm text-gray-500 mb-2">
								Secteur: {walls.map((wall) => wall.name).join(', ')}
							</p>

							{#if route.description}
								<p class="text-gray-700 mb-4">{route.description}</p>
							{/if}

							<div class="flex-1 min-h-0">
								<a href="/pan/gym/{gym.id}/route/{route.id}" class="block h-full">
									<RouteThumbnail walls={gym.walls} route={route.moves} legend={false} />
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
		{/if}

		<h2 class="h2 mt-8">Gallerie des murs</h2>
		<div class="mb-4">
			<p class="text-gray-600">
				{gym.walls.length} mur{gym.walls.length !== 1 ? 's' : ''} défini{gym.walls.length !== 1
					? 's'
					: ''}
			</p>
		</div>
		{@render AddWallButton()}

		<!-- Edit walls butto -->
		<a
			href="/pan/gym/{gym.id}/walls"
			class="mb-4 ml-4 inline-block bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
		>
			Éditer les murs
		</a>

		<div class="h-70">
			<WallGalery walls={gym.walls} />
		</div>
	{/if}
</div>

<style>
	h2 {
		margin-bottom: 20px;
	}
</style>
