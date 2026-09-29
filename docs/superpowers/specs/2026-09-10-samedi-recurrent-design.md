# Créneaux récurrents du samedi (09:00–13:00)

**Date :** 2026-09-10
**Statut :** Validé (approche A, config en dur, récurrence chaque semaine sans exception)

## Contexte

Le planning du CAF affiche les créneaux de bénévoles pour les 60 prochains jours.
Actuellement :

- Les jours récurrents sont codés en dur dans `src/routes/utils.ts:18` : `[1, 2, 5]`
  (lundi, mardi, vendredi — numérotation Luxon).
- La grille horaire est **globale et unique** : `timeslots` = 18:00 → 22:00 par pas
  de 30 min (`src/routes/utils.ts:43-48`).
- La page planning (`src/routes/planning/+page.svelte`) utilise cette grille pour :
  - les selects début/fin du créneau personnel,
  - les cellules de présence du tableau,
  - le header du tableau (heures 18:00→21:00 **écrites en dur** dans le HTML).
- Les créneaux ponctuels (jours hors récurrents) viennent de la table `events`
  (type `new-slot`) et utilisent la même grille globale.

**Objectif :** ajouter le samedi comme jour récurrent avec une grille 09:00 → 13:00,
sans modifier les autres jours.

## Décisions

- **Config en dur** dans le code (pas de table ni d'UI admin) — choix utilisateur.
- **Récurrence chaque semaine**, sans exception ni date de début, dès la mise en prod.
- **Approche A** : un map de config par jour + une fonction génératrice de grille.
- La grille 30 min et le format `'HH:MM'` zéro-padé sont conservés.

## Design

### 1. `src/routes/utils.ts` — source de vérité unique

```ts
export const RECURRING_DAYS = {
	1: { start: 18, end: 22 }, // lundi
	2: { start: 18, end: 22 }, // mardi
	5: { start: 18, end: 22 }, // vendredi
	6: { start: 9, end: 13 } // samedi
} as const;

// Grille par défaut pour les jours ponctuels (new-slot) hors jours récurrents
export const DEFAULT_TIMES = { start: 18, end: 22 } as const;

export function get_timeslots(start: number, end: number): string[];
// → ['09:00', '09:30', …, '13:00'] (inclusif, pas de 30 min, 'HH:MM' zéro-padé)
```

- `create_slots(events)` : remplace `[1, 2, 5].includes(day.weekday)` par
  `day.weekday in RECURRING_DAYS`.
- Le slot généré expose désormais `weekday` (numérotation Luxon 1=lundi … 7=dimanche)
  pour que le template puisse choisir sa grille.
- La constante `timeslots` est **supprimée** (importée uniquement par
  `planning/+page.svelte` — vérifié).

### 2. `src/routes/planning/+page.svelte` — grilles par jour

- Chaque card calcule sa grille depuis `row.weekday` :
  `const ts = get_timeslots(...(RECURRING_DAYS[row.weekday] ?? DEFAULT_TIMES));`
  (les jours ponctuels `new-slot` hors samedi utilisent `DEFAULT_TIMES`, comme
  aujourd'hui).
- Selects début/fin et cellules de présence : `ts.slice(0, -1)` / `ts.slice(1)`
  (inchangé, appliqué à la grille du jour).
- **Header du tableau dynamique** : pour chaque heure `h` de `start` à `end - 1`,
  un `<th colspan="2">{hh}:00</th>` — supprime les 4 `<th>` écrits en dur.
  Samedi : 09:00, 10:00, 11:00, 12:00. Lun/mar/ven : inchangé visuellement.

### 3. Hors périmètre (aucun changement)

- **DB** : `slots` (day, start_at, end_at) et `events` sont indépendants de la
  récurrence. Pas de migration.
- **API** (`/api/slot`, `/api/event`) : inchangées.
- **Admin** (`admin/+page.svelte`) : utilise `create_slots({})` → le samedi devient
  automatiquement sélectionnable pour poser une exception (annulation / créneau
  additionnel). Aucune modification.

## Points d'attention

- **Zero-padding obligatoire** : le template compare les heures par chaîne
  (`ref.start <= time && ref.end > time`). `'9:00' > '13:00'` lexicalement → il
  faut `'09:00'`. La lecture DB (`toTimeString().slice(0, 5)`) produit déjà un
  format padé : cohérent.
- **Fuseau horaire (existant, hors scope)** : la lecture des heures via
  `toTimeString()` dépend du TZ du serveur. En local (CEST) les créneaux
  enregistrés s'affichent +2 h vs prod (UTC). Pour tester en conditions prod :
  `TZ=UTC npm run dev`.

## Tests

Aucun test existant dans le repo (vitest configuré, motif `src/**/*.test.ts`).
Création de `src/routes/utils.test.ts` :

- `get_timeslots` : bornes inclusives, pas de 30 min, zero-padding, grille 9-13.
- `create_slots` : samedis présents dans la fenêtre, lun/mar/ven présents, les
  autres jours absents ; jour ponctuel `new-slot` présent avec grille par défaut
  (via `weekday`).
