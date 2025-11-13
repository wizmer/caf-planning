<script lang="ts">
	import WallGallery from '$lib/components/WallGallery.svelte';

	let { data } = $props();
	console.log('data', data.gym.walls);
</script>

<WallGallery walls={data.gym.walls} isEditing={true} />
