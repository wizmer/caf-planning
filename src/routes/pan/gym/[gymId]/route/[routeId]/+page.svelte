<script lang="ts">
	import RouteViewer from '$lib/components/RouteViewer.svelte';

	let { data } = $props();

	const route = $derived(data.route);
</script>

<svelte:head>
	<title>Route - {route.name}</title>
</svelte:head>

<div class="container mx-auto p-4">
	<div class="mb-6">
		<h1 class="text-3xl font-bold">{route.name}</h1>
		<h2 class="text-xl text-gray-600 mb-2">{route.grade}</h2>
		<div class="flex justify-between">
			<a href="/pan/gym/{data.gym.id}" class="text-blue-600 hover:text-blue-800"> ← Back to Gym </a>
			<a href="/pan/gym/{data.gym.id}/route/{route.id}/edit" class="btn preset-tonal-secondary"
				>Modifier le bloc</a
			>
		</div>
	</div>

	<RouteViewer walls={data.gym.walls} route={route.body} />
</div>
