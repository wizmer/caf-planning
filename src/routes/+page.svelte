<script lang="ts">
	import type { PageData } from './$types';
	import SlotList from './SlotList.svelte';
	export let data: PageData;
</script>

<SlotList events={data.events} refs={data.slots} />
