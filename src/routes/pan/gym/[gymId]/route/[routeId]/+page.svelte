<script lang="ts">
	import GradeChip from '$lib/components/GradeChip.svelte';
	import RouteViewer from '$lib/components/RouteViewer.svelte';

	let { data } = $props();

	const route = $derived(data.route);
</script>

<svelte:head>
	<title>Route - {route.name}</title>
</svelte:head>

<div class="container mx-auto p-4">
	<div class="mb-6">
		<h1 class="text-3xl font-bold mb-2">{route.name}</h1>
		<GradeChip grade={route.grade} />
		<div class="mt-5 flex justify-between items-center">
			<a href="/pan/gym/{data.gym.id}" class="text-blue-600 hover:text-blue-800"> ← Retour </a>
			<a href="/pan/gym/{data.gym.id}/route/{route.id}/edit" class="btn preset-tonal-secondary"
				>Modifier le bloc</a
			>
		</div>
	</div>

	<RouteViewer walls={data.gym.walls} moves={route.moves} />
</div>
