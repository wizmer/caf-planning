<script lang="ts">
    import type {SvelteComponent} from 'svelte';
    import {ListBox, ListBoxItem} from '@skeletonlabs/skeleton';
    // Stores
    import {getModalStore} from '@skeletonlabs/skeleton';

    // Props
    /** Exposes parent props to this component. */
    export let parent: SvelteComponent;

    const modalStore = getModalStore();
 let showPassword = false;


    let flavor = 'chocolate';

    // Form Data
    const formData = {
        password: '',
    };

    // We've created a custom submit function to pass the response and close the modal.
    function onFormSubmit(): void {
        if ($modalStore[0].response) $modalStore[0].response(formData);
        modalStore.close();
    }

    // Base Classes
    const cBase = 'card p-4 w-modal shadow-xl space-y-4';
    const cHeader = 'text-2xl font-bold';
    const cForm = 'border p-4 space-y-4 rounded-container-token';

    let users = ['benoit', 'josiane', 'dom']
    let new_user = ''
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
    <div class="{cBase}">
        <header class={cHeader}>Referent</header>
        <!-- Enable for debugging: -->
        <form id="login-form" class="modal-form {cForm}">

            <div class="space-y-2">
	              <label class="flex items-center space-x-2">
		                <input class="radio" type="radio" checked name="radio-direct" value="1" />
                    <p>Utilisateur existant</p>
	              </label>

                    <ListBox class="border p-4 rounded-container-token">
                        {#each users as user}
                            <ListBoxItem bind:group={flavor} name={user} value={user}>{user}</ListBoxItem>
                        {/each}
                    </ListBox>

                <label class="flex items-center space-x-2">
		                <input class="radio" type="radio" name="radio-direct" value="2" />
		                <p>Nouvel utilisateur</p>
	              </label>
                <input class="input" type="text" bind:value={new_user} placeholder="Valentine S."/>

            </div>

            <label class="space-x-2">
                <p>Mot de passe</p>
                <input id="current-password"
                       class="input"
                       type={showPassword?"text":"password"}
                       name="password"
                       autocomplete="current-password"
                       placeholder="Mot de passe" required />
            </label>
            <label class="space-x-2">
                <p>Show Password</p>
                <input type="checkbox" bind:checked={showPassword}>
            </label>

        </form>
        <input class="btn {parent.buttonPositive}" on:click={onFormSubmit} type="submit" form="login-form" value="Valider"/>
    </div>
{/if}
