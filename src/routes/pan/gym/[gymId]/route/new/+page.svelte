<script lang="ts">
	import RouteEditor from '$lib/components/RouteEditor.svelte';

	let { data, form } = $props();

	let route = $state({
		body: []
	});
</script>

<svelte:head>
	<title>New Route - {data.gym.name}</title>
</svelte:head>

<RouteEditor {data} {form} {route}></RouteEditor>
