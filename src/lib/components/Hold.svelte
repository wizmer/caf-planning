<script lang="ts">
	import { Popover, Portal } from '@skeletonlabs/skeleton-svelte';
	import HoldEditor from './HoldEditor.svelte';

	let {
		move = $bindable(),
		idx,
		isEditing = false,
		editingMove = $bindable(),
		updateMoveType,
		updateMoveRadius,
		deleteMove,
		handleMoveDragStart,
		currentWallMoves = $bindable()
	} = $props();

	let holdRadius = $derived(move.radius || 16);
</script>

<div
	class="absolute"
	style="left: {move.x}%; top: {move.y}%; transform: translate(-50%, -50%); animation-delay: {idx *
		0.15}s; pointer-events: none;"
>
	<!-- Spinning ring around the circle -->
	<div
		class="spinner-ring"
		style="width: {holdRadius * 2 + 16}px; height: {holdRadius * 2 +
			16}px; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); --spinner-color: var(--hold-{move.type.replace(
			'_',
			'-'
		)});"
	></div>

	{#snippet circle()}
		<div
			class="rounded-full border-4 {move.type} shadow-lg move-circle-inner {isEditing
				? 'hover:scale-110'
				: 'hover:scale-125'}  transition-transform duration-300"
			style="width: {holdRadius * 2}px; height: {holdRadius * 2}px;"
		></div>
	{/snippet}

	{#if !isEditing}
		{@render circle()}
	{:else}
		<Popover defaultOpen={true}>
			<Popover.Trigger
				class="btn {isEditing ? 'cursor-move' : 'cursor-pointer'}"
				onmousedown={(e) => isEditing && handleMoveDragStart(e, move)}
				style="pointer-events: auto;"
			>
				{@render circle()}
			</Popover.Trigger>
			<Portal>
				<Popover.Positioner>
					<Popover.Content
						class="card w-96 bg-surface-500 p-3 shadow-xl min-w-[250px] max-h-[500px]"
					>
						<HoldEditor
							bind:move
							onUpdateType={(type) => updateMoveType(move, type)}
							onUpdateRadius={(radius) => updateMoveRadius(move, radius)}
							onDelete={() => deleteMove(move)}
							onClose={() => (editingMove = null)}
						/>

						<Popover.Arrow
							class="[--arrow-size:--spacing(4)] [--arrow-background:var(--color-surface-500)]"
						>
							<Popover.ArrowTip />
						</Popover.Arrow>
					</Popover.Content>
				</Popover.Positioner>
			</Portal>
		</Popover>
	{/if}
</div>

<style>
	@keyframes spin {
		from {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		to {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.6;
			scale: 0.95;
		}
		50% {
			opacity: 1;
			scale: 1.05;
		}
	}

	.spinner-ring {
		border-radius: 50%;
		border: 3px solid transparent;
		border-top-color: rgba(var(--spinner-color), 0.9);
		border-right-color: rgba(var(--spinner-color), 0.6);
		border-bottom-color: rgba(var(--spinner-color), 0.3);
		animation: spin 1.2s linear infinite;
		pointer-events: none;
		will-change: transform;
		filter: drop-shadow(0 0 4px rgba(var(--spinner-color), 0.5));
	}

	.move-circle-inner {
		position: relative;
		z-index: 10;
		animation: pulse 2s ease-in-out infinite;
		will-change: opacity, scale;
		background-color: transparent;
	}
</style>
