<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Gym } from '@prisma/client';
	import type { ActionData } from '@sveltejs/kit';

	interface Props {
		form?: ActionData;
		gym?: Gym | null;
		isEditing?: boolean;
		cancelUrl?: string;
	}

	let {
		form = null,
		gym = null,
		isEditing = false,
		cancelUrl = '/pan/gym'
	}: Props = $props();

	let gymName = $state(gym?.name || '');
	let gymDescription = $state(gym?.description || '');
	let isSubmitting = $state(false);

	let submitText = $derived(isEditing ? 'Update Gym' : 'Create Gym');
	let submittingText = $derived(isEditing ? 'Updating...' : 'Creating...');
</script>

<form
	method="POST"
	use:enhance={() => {
		isSubmitting = true;
		return async ({ update }) => {
			isSubmitting = false;
			update();
		};
	}}
	class="space-y-4"
>
	<label class="label">
		<span>Gym Name *</span>
		<input
			class="input"
			type="text"
			name="gymName"
			bind:value={gymName}
			placeholder="e.g., Boulder Central, Rock City Climbing"
			required
		/>
	</label>

	<label class="label">
		<span>Description</span>
		<textarea
			class="textarea"
			name="gymDescription"
			bind:value={gymDescription}
			placeholder="Optional description of the gym..."
			rows="4"
		></textarea>
	</label>

	{#if form?.error}
		<aside class="alert preset-filled-error-500">
			<div class="alert-message">
				<p>{form.error}</p>
			</div>
		</aside>
	{/if}

	<div class="flex gap-4">
		<button type="submit" disabled={isSubmitting} class="btn preset-filled-primary-500 flex-1">
			{isSubmitting ? submittingText : submitText}
		</button>
		<a href={cancelUrl} class="btn preset-tonal-surface">Cancel</a>
	</div>
</form>
