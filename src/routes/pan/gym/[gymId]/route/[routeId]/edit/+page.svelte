<script lang="ts">
	import RouteEditor from '$lib/components/RouteEditor.svelte';

	let { data, form } = $props();
	let route = $state(data.route);
</script>

<svelte:head>
	<title>Edition du bloc - {data.gym.name}</title>
</svelte:head>

<RouteEditor {data} {form} bind:route></RouteEditor>

<form method="POST" action="?/delete">
	<button class="btn preset-tonal-error" type="submit">Supprimer la route</button>
</form>
