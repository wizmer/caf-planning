# Créneaux récurrents du samedi — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter le samedi comme jour récurrent (09:00–13:00) à côté de lun/mar/ven (18:00–22:00), avec une grille horaire par jour.

**Architecture:** Une seule source de vérité dans `src/routes/utils.ts` : map `RECURRING_DAYS` (jour → bornes horaires) + fonctions génératrices `get_timeslots` / `get_hour_labels`. La page planning calcule sa grille par jour et son header de tableau dynamiquement. Aucun changement DB ni API.

**Tech Stack:** SvelteKit 2 / Svelte 5, TypeScript, vitest (config existante : `src/**/*.test.ts`), luxon.

## Global Constraints

- Grille par pas de 30 min, bornes inclusives, format `'HH:MM'` **zéro-padé** (`'09:00'`, jamais `'9:00'`) — les comparaisons lexicales du template en dépendent.
- Lun/mar/ven restent 18:00–22:00 ; samedi 09:00–13:00 ; récurrence chaque semaine, sans exception.
- Jours ponctuels `new-slot` hors jours récurrents : grille par défaut 18:00–22:00 (comportement actuel préservé).
- Aucune migration DB, aucun changement d'API (`/api/slot`, `/api/event`).
- Suivre le style existant : tabs, guillemets simples, code français dans l'UI.
- Pas de commentaires dans le code.

---

### Task 1: Config par jour + helpers dans `src/routes/utils.ts`

**Files:**

- Modify: `src/routes/utils.ts`
- Create: `src/routes/utils.test.ts`

**Interfaces:**

- Consumes: `DateTime` de luxon (déjà importé), `events` au format `{ [day: string]: [id, day, type] }` (déjà le cas).
- Produces (utilisés par Task 2) :
  - `RECURRING_DAYS: Record<number, { start: number; end: number }>` (clés Luxon : 1=lundi … 7=dimanche)
  - `DEFAULT_TIMES: { start: number; end: number }`
  - `get_timeslots(start: number, end: number): string[]` — grille 30 min zéro-padée, inclusive
  - `get_hour_labels(start: number, end: number): string[]` — une étiquette `HH:00` par heure pleine, fin exclue
  - `create_slots(events)` — inchangé en signature, mais chaque slot expose désormais `weekday: number`, et le samedi est récurrent
  - `timeslots` (constante exportée) est **supprimée** — plus aucune importation après Task 2

- [ ] **Step 1: Écrire les tests (échouants)**

Créer `src/routes/utils.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { DateTime } from 'luxon';
import { create_slots, get_hour_labels, get_timeslots, RECURRING_DAYS } from './utils';

describe('get_timeslots', () => {
	it('génère la grille du samedi 9-13, bornes incluses, zéro-padée', () => {
		expect(get_timeslots(9, 13)).toEqual([
			'09:00',
			'09:30',
			'10:00',
			'10:30',
			'11:00',
			'11:30',
			'12:00',
			'12:30',
			'13:00'
		]);
	});

	it('conserve la grille du soir 18-22', () => {
		expect(get_timeslots(18, 22)).toEqual([
			'18:00',
			'18:30',
			'19:00',
			'19:30',
			'20:00',
			'20:30',
			'21:00',
			'21:30',
			'22:00'
		]);
	});

	it('est triée lexicalement (comparaisons du template valides)', () => {
		const grid = get_timeslots(9, 13);
		expect(grid).toEqual([...grid].sort());
	});
});

describe('get_hour_labels', () => {
	it('retourne une étiquette par heure pleine, fin exclue', () => {
		expect(get_hour_labels(9, 13)).toEqual(['09:00', '10:00', '11:00', '12:00']);
		expect(get_hour_labels(18, 22)).toEqual(['18:00', '19:00', '20:00', '21:00']);
	});
});

describe('create_slots', () => {
	const values = Object.values(create_slots({}));

	it('inclut lun, mar, ven et sam (≥ 8 occurrences chacun sur 60 jours)', () => {
		for (const weekday of [1, 2, 5, 6]) {
			const count = values.filter((slot) => slot.weekday === weekday).length;
			expect(count).toBeGreaterThanOrEqual(8);
		}
	});

	it('exclut mercredi, jeudi et dimanche', () => {
		for (const weekday of [3, 4, 7]) {
			expect(values.some((slot) => slot.weekday === weekday)).toBe(false);
		}
	});

	it('expose une weekday couverte par RECURRING_DAYS', () => {
		for (const slot of values) {
			expect(RECURRING_DAYS[slot.weekday]).toBeDefined();
		}
	});

	it('ajoute un jour ponctuel new-slot même hors jours récurrents', () => {
		let target = DateTime.now()
			.setZone('utc+0', { keepLocalTime: true })
			.startOf('day')
			.plus({ days: 5 });
		while (target.weekday !== 3) target = target.plus({ days: 1 });
		const dayStr = target.toISO().slice(0, 10);
		const slots = create_slots({ [dayStr]: [1, dayStr, 'new-slot'] });
		expect(slots[dayStr]).toBeDefined();
		expect(slots[dayStr].weekday).toBe(3);
	});
});
```

- [ ] **Step 2: Vérifier que les tests échouent**

Run: `npx vitest run src/routes/utils.test.ts`
Expected: FAIL — `get_timeslots`/`get_hour_labels` non exportés, samedis absents de `create_slots`.

- [ ] **Step 3: Implémenter dans `src/routes/utils.ts`**

Remplacer tout le contenu par :

```ts
import { DateTime } from 'luxon';

export interface Times {
	start: number;
	end: number;
}

export const RECURRING_DAYS: Record<number, Times> = {
	1: { start: 18, end: 22 },
	2: { start: 18, end: 22 },
	5: { start: 18, end: 22 },
	6: { start: 9, end: 13 }
};

export const DEFAULT_TIMES: Times = { start: 18, end: 22 };

export function get_timeslots(start: number, end: number): string[] {
	const timeslots: string[] = [];
	for (let minutes = start * 60; minutes <= end * 60; minutes += 30) {
		const h = String(Math.floor(minutes / 60)).padStart(2, '0');
		const m = String(minutes % 60).padStart(2, '0');
		timeslots.push(`${h}:${m}`);
	}
	return timeslots;
}

export function get_hour_labels(start: number, end: number): string[] {
	const labels: string[] = [];
	for (let h = start; h < end; h++) {
		labels.push(`${String(h).padStart(2, '0')}:00`);
	}
	return labels;
}

export function create_slots(events) {
	const slots = {};

	const newSlotEvents = Object.fromEntries(
		Object.entries(events).filter(([key, value]) => {
			return value[2] === 'new-slot';
		})
	);

	const today = DateTime.now().setZone('utc+0', { keepLocalTime: true }).startOf('day');

	for (let i = 0; i < 60; i++) {
		const day = today.plus({ days: i }) as DateTime;

		const dayStr = day.toISO().slice(0, 10);
		if (!(day.weekday in RECURRING_DAYS) && !(dayStr in newSlotEvents)) {
			continue;
		}
		const item = {
			id: i,
			day: dayStr,
			weekday: day.weekday,
			month: day.month,
			// date: day.toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
			date: day.toJSDate(),
			status: 'ok',
			adding_slot: false,
			refs: {}
		};

		// let cancelled_day = new Date(2024, 0, 19);
		// if (day.toDateString() == cancelled_day.toDateString()) {
		//     item.status = "cancelled";
		// }

		slots[item.day] = item;
	}

	return slots;
}

export function capitalize(val) {
	return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
```

Notes :

- L'ancienne constante `timeslots` (18-22) est supprimée ; le commentaire `// date:` et le bloc `cancelled_day` commentés sont conservés tels quels (style existant).
- Seuls les changements fonctionnels : condition de récurrence (`day.weekday in RECURRING_DAYS`), champ `weekday` dans l'item, suppression de `timeslots`.

- [ ] **Step 4: Vérifier que les tests passent**

Run: `npx vitest run src/routes/utils.test.ts`
Expected: PASS (tous les tests).

⚠️ À ce stade `planning/+page.svelte` importe encore `timeslots` — l'app ne compile plus tant que Task 2 n'est pas faite. Ne pas lancer le dev server entre les deux tasks.

- [ ] **Step 5: Commit**

```bash
git add src/routes/utils.ts src/routes/utils.test.ts
git commit -m "feat(planning): Add per-day recurring config and timeslot helpers

Replace the hardcoded [1, 2, 5] weekday list and the single global
18:00-22:00 timeslot grid with a RECURRING_DAYS map plus generated
grids. Adds Saturday 09:00-13:00 as a recurring day; slots now expose
their weekday so the UI can pick the right grid."
```

---

### Task 2: Page planning — grilles par jour + header dynamique

**Files:**

- Modify: `src/routes/planning/+page.svelte`

**Interfaces:**

- Consumes: `RECURRING_DAYS`, `DEFAULT_TIMES`, `get_timeslots`, `get_hour_labels` depuis `../utils` (Task 1). `row.weekday` (nombre Luxon 1-7) présent sur chaque slot depuis Task 1.
- Produces: rien (consommateur final).

- [ ] **Step 1: Mettre à jour l'import (ligne 8)**

```svelte
import {(RECURRING_DAYS, DEFAULT_TIMES, capitalize, create_slots, get_hour_labels, get_timeslots)} from
'../utils';
```

- [ ] **Step 2: Ajouter les helpers de grille par jour (dans le `<script>`, après la déclaration `slots`)**

```ts
function day_grid(weekday: number): string[] {
	const times = RECURRING_DAYS[weekday] ?? DEFAULT_TIMES;
	return get_timeslots(times.start, times.end);
}

function day_hours(weekday: number): string[] {
	const times = RECURRING_DAYS[weekday] ?? DEFAULT_TIMES;
	return get_hour_labels(times.start, times.end);
}
```

- [ ] **Step 3: Header du tableau dynamique (remplacer les lignes 144-152)**

Remplacer :

```svelte
<thead class="divider-x">
	<tr>
		<th>Nom</th>
		<th colspan="2">18:00</th>
		<th colspan="2">19:00</th>
		<th colspan="2">20:00</th>
		<th colspan="2">21:00</th>
	</tr>
</thead>
```

par :

```svelte
<thead class="divider-x">
	<tr>
		<th>Nom</th>
		{#each day_hours(row.weekday) as hour}
			<th colspan="2">{hour}</th>
		{/each}
	</tr>
</thead>
```

- [ ] **Step 4: Selects et cellules de présence sur la grille du jour**

- Ligne ~106 (select début) : `{#each timeslots.slice(0, -1) as time}` → `{#each day_grid(row.weekday).slice(0, -1) as time}`
- Ligne ~117 (select fin) : `{#each timeslots.slice(1) as time}` → `{#each day_grid(row.weekday).slice(1) as time}`
- Ligne ~170 (cellules présence) : `{#each timeslots.slice(0, -1) as time}` → `{#each day_grid(row.weekday).slice(0, -1) as time}`

- [ ] **Step 5: Vérifier la compilation et les tests**

Run: `npx svelte-kit sync && npm run check`
Expected: aucune erreur dans les fichiers modifiés (`planning/+page.svelte`, `utils.ts`). Les erreurs préexistantes ailleurs sont hors scope — les noter sans corriger.

Run: `npx vitest run src/routes/utils.test.ts`
Expected: PASS.

- [ ] **Step 6: Vérification smoke sur le dev server (HMR actif)**

```bash
curl -sL http://localhost:5173/planning | grep -oE '(09|10|11|12|18|19|20|21):00' | sort | uniq -c
```

Expected: les deux familles d'heures présentes — `09:00, 10:00, 11:00, 12:00` (cards samedi) **et** `18:00, 19:00, 20:00, 21:00` (cards lun/mar/ven). Aucune erreur 500 dans `/tmp/caf-planning-dev.log`.

- [ ] **Step 7: Commit**

```bash
git add src/routes/planning/+page.svelte
git commit -m "feat(planning): Render per-day timeslot grids in planning UI

Each day card now builds its selects, presence table and header from
its own grid: 18:00-22:00 for Mon/Tue/Fri, 09:00-13:00 for Saturday,
default evening grid for extra new-slot days. The hardcoded 18:00-21:00
table header is gone."
```

---

### Task 3: Vérification finale

**Files:** aucun (validation uniquement)

- [ ] **Step 1: Suite complète**

Run: `npx vitest run` (tous les tests unitaires) — Expected: PASS.
Run: `npm run check` — Expected: pas d'erreur nouvelle.

- [ ] **Step 2: Smoke test UI**

Ouvrir http://localhost:5173/planning : cards samedi avec créneaux 09:00→13:00, cards lun/mar/ven avec 18:00→22:00, header du tableau samedi affichant 09:00→12:00.

- [ ] **Step 3: Bilan**

Rapporter : fichiers modifiés, tests verts, captures/extraits HTML. Ne pas merger (décision utilisateur).
