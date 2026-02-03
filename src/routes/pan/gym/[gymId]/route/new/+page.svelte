<script lang="ts">
	import RouteEditor from '$lib/components/RouteEditor.svelte';
	import type { Move, Prisma } from '@prisma/client';

	let { data, form } = $props();

	let route: Prisma.RouteUncheckedCreateInput & { moves: Move[] } = $state({
		id: 0,
		name: '',
		grade: '',
		color: '',
		wallId: 0,
		moves: []
	});
</script>

<svelte:head>
	<title>New Route - {data.gym.name}</title>
</svelte:head>

<RouteEditor {data} {form} bind:route></RouteEditor>
