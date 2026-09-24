# Configuration des horaires récurrents en DB (édition admin)

**Date :** 2026-09-10
**Statut :** Validé (approche A, suite au retour sur feat/samedi-recurrent)
**Base :** branche `feat/samedi-recurrent` — la config en dur `RECURRING_DAYS` (lun/mar/ven 18-22, sam 9-13) devient éditable depuis l'admin.

## Contexte

Depuis la feature samedi, les horaires récurrents vivent en dur dans
`src/routes/utils.ts` (`RECURRING_DAYS`). Retour utilisateur : la config des
horaires **par jour** doit être modifiable en base depuis l'interface admin,
avec la possibilité d'**activer/désactiver des jours** (pas seulement éditer
les heures des 4 jours actuels).

## Décisions

- Jours **activables/désactivables** (les 7 jours gérés, pas seulement les 4).
- Heures **pleines** uniquement (0-23) via selects ; la grille des créneaux
  reste par pas de 30 min.
- Approche A : table dédiée + fallback sur la config en dur.

## Design

### 1. DB — table `recurring_days`

```prisma
model recurring_days {
  weekday Int  @id // 1 = lundi … 7 = dimanche (Luxon)
  start   Int
  end     Int
  active  Bool @default(true)
}
```

Migration SQL : création + **seed des 7 jours** — lun(1)/mar(2)/ven(5)/sam(6)
actifs avec les horaires actuels (18-22, 18-22, 18-22, 9-13) ;
mer(3)/jeu(4)/dim(7) inactifs (18-22 par défaut). **Comportement de prod
inchangé au déploiement.** Après application en local, `sql/init.sql` est
régénéré (`npm run db:pgdump:dev`) pour que les conteneurs neufs aient la table.

### 2. Config et `create_slots`

- `Times` gagne `active?: boolean` (absent/undefined = actif → compat avec
  l'existant). Type `RecurringConfig = Record<number, Times>`.
- `create_slots(events, config = RECURRING_DAYS)` : nouveau paramètre
  optionnel, filtre `entry.active !== false`. Signature rétrocompatible
  (`admin/+page.svelte` et les tests existants passent tels quels).
- `config_from_rows(rows)` (dans utils, testé) : normalise les lignes DB en
  `RecurringConfig` ; lignes vides → `RECURRING_DAYS` (fallback).
- `get_timeslots` / `get_hour_labels` : inchangés (heures pleines).
- `RECURRING_DAYS` reste : config par défaut, fallback, et miroir du seed.

### 3. Chargement et API

- `+layout.server.ts` : lit `recurring_days` (try/catch existant), retourne
  `recurring` = config normalisée (map). Planning et admin consomment
  `data.recurring`.
- `POST /api/recurring` (nouveau) : body = tableau des 7 lignes
  `{weekday, start, end, active}`. Validation : entier, weekday 1-7,
  `0 ≤ start < end ≤ 24`. Application en transaction : `deleteMany` +
  `createMany`. Réponse `ok` / 400 si invalide.
- Auth : même modèle que les endpoints existants (mot de passe vérifié côté
  client — fragilité préexistante, non aggravée).

### 4. UI admin — 3e carte « Horaires récurrents »

Dans `admin/+page.svelte` (après les cartes existantes) : 7 lignes triées par
weekday, chacune avec :
- nom du jour en français (constante locale, `capitalize`),
- checkbox « actif »,
- select début (0-23) et select fin (1-24, options ≤ début désactivées).

Un bouton « Enregistrer » global : POST des 7 lignes → toast succès/erreur →
`invalidateAll()` (le planning et l'admin se re-rendent avec la nouvelle
grille). État local initialisé depuis `data.recurring`.

### 5. Planning

`planning/+page.svelte` : `create_slots(events, data.recurring)` — les
grilles par jour et le header dynamique existants suivent automatiquement.

## Tests

- `utils.test.ts` (extension) : `create_slots` avec config custom — jour
  inactif exclu, horaires custom reflétés dans `weekday`/grille, fallback
  par défaut sans paramètre ; `config_from_rows` — normalisation + fallback
  table vide.
- Manuel : édition depuis l'admin → planning mis à jour ; validation 400
  (start ≥ end) ; redémarrage conteneur neuf (init.sql régénéré).

## Hors périmètre

- Auth serveur des endpoints (limitation préexistante du repo).
- Édition des minutes (heures pleines uniquement).
- Page dédiée de config (carte admin suffit).
