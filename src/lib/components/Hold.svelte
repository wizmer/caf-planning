<script lang="ts">
	import { Popover, Portal } from '@skeletonlabs/skeleton-svelte';
	import HoldEditor from './HoldEditor.svelte';

	let {
		move = $bindable(),
		idx,
		openedMoveId = $bindable(),
		isEditing = false,
		deleteMove,
		imageWidth = 0
	} = $props();

	// Calculate pixel radius from percentage of image width
	let holdRadius = $derived(imageWidth > 0 ? (move.radius * imageWidth) / 100 : 16);
	let color = $derived(`var(--hold-${move.type.replace('_', '-')})`);

	function handleMoveDragStart(event: MouseEvent, index: number) {
		if (!isEditing) return;
		event.stopPropagation();

		const img = (event.currentTarget as HTMLElement).closest('.wall-image-container');
		if (!img) return;

		const handleDrag = (e: MouseEvent) => {
			const rect = img.getBoundingClientRect();
			const x = ((e.clientX - rect.left) / rect.width) * 100;
			const y = ((e.clientY - rect.top) / rect.height) * 100;

			if (index !== -1) {
				move.x = Math.max(0, Math.min(100, Math.round(x * 10) / 10));
				move.y = Math.max(0, Math.min(100, Math.round(y * 10) / 10));
			}
		};

		const handleDragEnd = () => {
			document.removeEventListener('mousemove', handleDrag);
			document.removeEventListener('mouseup', handleDragEnd);
		};

		document.addEventListener('mousemove', handleDrag);
		document.addEventListener('mouseup', handleDragEnd);
	}
</script>

<div
	class="absolute"
	style="left: {move.x}%; top: {move.y}%; transform: translate(-50%, -50%); animation-delay: {idx *
		0.15}s; pointer-events: none;"
>
	<div
		class="spinner-ring"
		style="width: {holdRadius * 2 + 16}px; height: {holdRadius * 2 +
			16}px; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); --spinner-color: {color};"
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
		<Popover defaultOpen={openedMoveId === idx}>
			<Popover.Trigger
				class="btn {isEditing ? 'cursor-move' : 'cursor-pointer'}"
				onmousedown={(e) => isEditing && handleMoveDragStart(e, idx)}
				style="pointer-events: auto;"
			>
				{@render circle()}
			</Popover.Trigger>
			<Portal>
				<Popover.Positioner>
					<Popover.Content
						class="card w-96 bg-surface-500 p-3 shadow-xl min-w-[250px] max-h-[500px]"
					>
						<HoldEditor bind:move {idx} onDelete={deleteMove} />

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

<!-- <style>
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
</style> -->
