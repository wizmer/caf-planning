<script lang="ts">
 import type {SvelteComponent} from 'svelte';
 import {ListBox, ListBoxItem} from '@skeletonlabs/skeleton';
 // Stores
 import {user} from '$lib/stores'
 import {getModalStore} from '@skeletonlabs/skeleton';

 // Props
 /** Exposes parent props to this component. */
 export let parent: SvelteComponent;

 const modalStore = getModalStore();
 let showPassword = false;

 let current_user = $user;

 let failed_login_text = ''

 let password = ''

 // We've created a custom submit function to pass the response and close the modal.
     function onFormSubmit(): void {
         //         if ($modalStore[0].response) $modalStore[0].response(formData);
         if(password != 'robert'){
             failed_login_text = 'Mot de passe incorrect'
             return
         }

         failed_login_text = ''
         $user = current_user
         modalStore.close();
     }

 // Base Classes
 const cBase = 'card p-4 w-modal shadow-xl space-y-4';
 const cHeader = 'text-2xl font-bold';
 const cForm = 'p-2 space-y-4 rounded-container-token';

 let new_user = ''
 let refs = ['benoit', 'pierre', 'josiane']

</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
    <div class="{cBase}">
        <header class={cHeader}>Referent</header>
        <form id="login-form" class="modal-form {cForm}">
            <div class="card">
                <header class="card-header">
	                  <label class="flex items-center space-x-2">
		                    <input class="radio" type="radio" checked name="radio-direct" value="1" />
                        <p>Utilisateur existant</p>
	                  </label>
                </header>

                <section class="p-4">
                    <ListBox class="border p-4 rounded-container-token">
                        {#each refs as item}
                            <ListBoxItem bind:group={current_user} name={item} value={item}>{item}</ListBoxItem>
                        {/each}
                    </ListBox>
                </section>

            </div>
            <div class="card">

                <header class="card-header">
                <label class="flex items-center space-x-2">
		                <input class="radio" type="radio" name="radio-direct" value="2" />
		                <p>Nouvel utilisateur</p>
	              </label>
                </header>

                <section class="p-4">
                <input
                    id="new-user"
                    class="input"
                    type="text"
                    name="new-user"
                    bind:value={new_user}
                           autocomplete="off"
                    placeholder="Valentine S."/>
                </section>
            </div>

            <label class="space-x-2">
                <p>Mot de passe</p>
                <input id="current-password"
                       class="input"
                       type="password"
                       name="password"
                       bind:value={password}
                       autocomplete="current-password"
                       placeholder="Mot de passe" required />
            </label>
            <!-- <label class="space-x-2">
                 <p>Show Password</p>
                 <input type="checkbox" bind:checked={showPassword}>
                 </label> -->

        </form>

        <footer class="modal-footer {parent.regionFooter}">
            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Annuler</button>
            <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}
            type="submit" form="login-form">Login</button>
            {#if failed_login_text}
                <div class="text-red" >{failed_login_text}</div>
                {/if}
        </footer>
    </div>
{/if}
