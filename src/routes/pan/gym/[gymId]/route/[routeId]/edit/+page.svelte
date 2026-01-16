<script lang="ts">
	import RouteEditor from '$lib/components/RouteEditor.svelte';

	let { data, form } = $props();
	const route = $state(data.route);
</script>

<svelte:head>
	<title>Edition du bloc - {data.gym.name}</title>
</svelte:head>

<RouteEditor {data} {form} {route}></RouteEditor>
