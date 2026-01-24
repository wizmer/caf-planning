<script lang="ts">
	import { page } from '$app/state';
	import WallGallery from '$lib/components/WallGallery.svelte';

	let { data } = $props();

	const route = data.gym.routes.find((r: any) => r.id === parseInt(page.params.routeId));

	if (!route) {
		throw new Error('Route not found');
	}
	$inspect(route);
</script>

<svelte:head>
	<title>Route - {route.name}</title>
</svelte:head>

<div class="container mx-auto p-4">
	<div class="mb-6">
		<h1 class="text-3xl font-bold">{route.name}</h1>
		<h2 class="text-xl text-gray-600 mb-2">Grade: {route.grade}</h2>
		<a href="/pan/gym/{data.gym.id}" class="text-blue-600 hover:text-blue-800"> ← Back to Gym </a>
	</div>

	<WallGallery walls={data.gym.walls} route={route.body} />

	<a href="/pan/gym/{data.gym.id}/route/{route.id}/edit">Modifier le bloc</a>
</div>
