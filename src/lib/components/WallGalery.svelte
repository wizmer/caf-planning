<script lang="ts">
	import { PUBLIC_UPLOAD_URL } from '$env/static/public';
	import type { Wall } from '@prisma/client';

	let { walls = [] as Wall[] } = $props();
</script>

<div class="h-70 flex justify-center space-x-2 overflow-x-scroll">
	{#each walls as wall, index}
		<img
			src="{PUBLIC_UPLOAD_URL}/{wall.photo.file_path}"
			alt={wall.name}
			class="object-contain rounded-md border border-surface-300 hover:border-surface-400"
		/>
	{/each}
</div>
