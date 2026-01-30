<script lang="ts">
	import { PUBLIC_UPLOAD_URL } from '$env/static/public';
	import { getMoveBorderColor } from '$lib/move-utils';
	import type { Move } from '$lib/types';
	let { walls, route = $bindable([]) as Move[], isEditing = false, legend = true } = $props();

	console.log('WallGallery loaded:', { walls: walls.length, isEditing, route: route.length });

	let currentWall = $derived(walls.find((wall) => wall.id === route[0]?.wallId) || walls[0]);
	let currentWallMoves = $derived(route.filter((move) => move.wallId === currentWall?.id) || []);
</script>

{#if walls.length > 0}
	<div class="relative h-full flex flex-col">
		<!-- Main Image Display -->
		<div
			class="relative card overflow-hidden wall-image-container flex-1 min-h-0 flex items-center justify-center bg-surface-900"
		>
			<img
				src="{PUBLIC_UPLOAD_URL}/{currentWall.photo.file_path}"
				alt={currentWall.name}
				class="max-w-full max-h-full object-contain block {isEditing ? 'cursor-crosshair' : ''}"
			/>

			<!-- Render moves as overlays -->
			{#each currentWallMoves as move, idx}
				<div
					class="absolute"
					style="left: {move.x}%; top: {move.y}%; transform: translate(-50%, -50%);"
				>
					<div
						class="w-8 h-8 rounded-full border-4 {getMoveBorderColor(move.type)} shadow-lg"
					></div>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<div class="text-center py-12">
		<p class="text-surface-500 text-lg">No walls found for this gym.</p>
	</div>
{/if}
