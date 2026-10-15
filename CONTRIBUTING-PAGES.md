# Écrire ou étoffer une page de Solo Tax Desk (us-self-employed)

Notice pour les agents qui écrivent ou prolongent le site. À lire en entier avant d'écrire, avec
`~/Documents/GitHub/RECETTE-SITE.md` (§0, §5, §6, §6.5, §7, §9.3, §11, §17.4, §21, §26).

**Le site** : impôts du travailleur indépendant américain pour l'année fiscale 2026 (self-employment tax, impôt
fédéral, QBI, acomptes trimestriels, safe harbor, pénalité) et choix de la structure (sole proprietorship, LLC,
S corp, C corp), avec une page par État (frais de LLC, franchise tax, impôt d'État, traitement des S corp,
impôts locaux) et quelques pages de villes. **Anglais américain seul**, sous `/en/`. Dollars, `$` devant,
virgule des milliers. Éditeur : la société **Radif Partners** (jamais un nom de personne, ni photo, ni diplôme).
Nom provisoire : Solo Tax Desk, URL provisoire `https://us-self-employed.example`.

**L'angle** (rapport SERP : `~/Documents/GitHub/reports/us-self-employed-serp-2026-10-15.md`) : la tête
« llc vs s corp » n'a que des articles sans calcul ; les calculateurs S corp sont des pages de cabinets qui vendent
(gusto, collective, keepertax, sdocpa) ; howtostartanllc n'a que deux champs, sans État ni année ; taxact n'a pas
2026 ; triplog affiche « 20XX ». Ici : le chiffre tout de suite, sans e-mail, avec 2026, l'État et les sources.

## Interdits (non négociables)

- Aucun lien vers LegalZoom, ZenBusiness, Northwest, Incfile, un cabinet, un logiciel fiscal, un service de paie,
  ni aucun site du portefeuille (`~/Documents/GitHub/_trame/domaines-ovh.txt`), en particulier truetakehomepay.com
  et taxyearcalc.com : ni lien, ni copie, ni reformulation.
- Aucun conseil personnalisé : on décrit, on calcule, on renvoie à un CPA ou un enrolled agent pour une décision.
- Aucun chiffre incertain : un nombre absent du kit ne s'écrit pas, sauf lu soi-même sur une source officielle
  (irs.gov, ssa.gov, site d'un État ou d'une ville) et cité avec `h.ext(url, …)` ; le signaler dans le compte rendu.

## D'où viennent les chiffres

| Donnée | Source | Fichier |
|---|---|---|
| Barèmes 2026, déduction standard, QBI, 179, seuils 1099 | Rev. Proc. 2025-32 | `src/data/params-2026.json` |
| SE tax, plafond 184 500 $ (2026) et 192 300 $ (2027), acomptes, safe harbor, dates | Form 1040-ES 2026, SSA (fiche COLA 2027 du 14/10/2026) | idem |
| FICA, FUTA | Publication 15 (2026) | idem |
| Barème kilométrique 72,5 ¢ puis 76 ¢ au 1er juillet 2026 | irs.gov standard mileage rates | idem |
| Plafonds retraite 2026 | Notice 2025-67 | idem |
| Taux d'intérêt de retard 2026 (7 %, 6 %, 7 %, 7 %) | irs.gov quarterly interest rates | idem |
| États : frais de LLC, rapport annuel, franchise / minimum tax, barème, S corp, impôts locaux | sites officiels lus le 2026-10-15 | `src/data/states.json` (construit par `scripts/build-states.py` depuis `research/states/*.json`) |

## Les fichiers d'une page

| Page | Fichier | Route |
|---|---|---|
| Sujet + calculateur | `src/content/guides/<id>.ts` (`defineGuide`) | `/en/<slug>/` |
| État | `src/content/states/<state-slug>.ts` (`defineState`) | `/en/<state-slug>/` |
| Ville ou comté | `src/content/local/<state-slug>--<place-slug>.ts` (`defineLocal`) | `/en/<state-slug>/<place-slug>/` |
| Accueil | `src/content/home.ts` | `/en/` |

Pages prévues : `src/lib/planned.ts`. **Modèle** : `src/content/guides/llc-vs-s-corp.ts` (copier la structure,
jamais les phrases).

Le gabarit affiche seul : H1, l'intro, le calculateur en tête (champ `tool`), le chapeau replié (`resume`), le corps
(`body`), la FAQ, les pages liées, les sources. Sur un État, il affiche aussi : le tableau « at a glance » (frais,
impôt, S corp, exemple à 75 000 $), le barème de l'État et le tableau des impôts locaux. **La prose ne répète pas
ces tableaux.**

### Champs

| Champ | Règle |
|---|---|
| `title` | 50 à 60 caractères, contient 2026, **terme-clé en tête** (« LLC vs S Corp 2026: … », « Schedule C 2026: … », « LLC Cost Texas 2026: … »). Jamais How/What/When/Calculator/About/US/USA/American en tête, pas de tiret cadratin, unique |
| `description` | 150 à 160 caractères, 2026, un chiffre du kit, unique |
| `intro` | une phrase propre à la page (sous le H1) |
| `resume` | **UN** paragraphe de 120 mots ou plus (viser 130 à 170) : la réponse à la requête avec les chiffres ; la première phrase porte le message |
| `body(h)` | HTML (`h2`, `h3`, `p`, `ul`, `h.table`). Guides : ≥ 650 mots de prose hors tableaux (viser 800 à 1 100). États : ≥ 350 (viser 400 à 550). Villes : ≥ 300 |
| `faqs` | guides 4 à 6, États 3 à 4 ; réponses **40 à 90 mots**, chiffre + condition + source ; une question n'existe qu'une fois sur tout le site (État : le nom dans la question) |
| `related` | 3 à 6 ids (`llc-vs-s-corp`, `state:texas`, `local:new-york/new-york-city`…) |
| `sources` (guides) | ≥ 2 clés de `params-2026.json > sources` |
| `tool` (guides) | voir `ToolKind` dans `src/lib/page-types.ts` |

## Le kit (règle des chiffres)

```ts
import { KIT as K } from '../../lib/kit';
K.P                                  // params-2026.json : K.P.se.wageBase['2026'], K.P.standardDeduction.single, K.P.qbi.threshold.mfj…
const s = K.st('texas');             // un État de states.json + yearly (coût LLC par an), cost5, first, ex75, ex120 (solo), cmp (S corp à 120 k)
s.llc.formation, s.llc.annual, s.llc.frequency, s.llc.minTax, s.llc.minTaxName, s.income.type/flat/brackets/std/exemption/verified/year,
s.scorp.recognized/rate/minimum, s.suta.wageBase/rate, s.local[] (place, name, rate, rateText, threshold, url), s.notable[], s.llcDetail.sources…
K.solo({ profit, filing: 'single'|'mfj'|'hoh'|'mfs', state?, w2Wages?, localRate?, healthPremiums?, retirement?, llcFees? })
   → { se: {total, ss, medicare, half, additionalMedicare, netEarnings}, agi, qbi: {deduction}, taxable, incomeTax, federalTotal, stateTax, localTax, total, setAside, quarterly }
K.scorp({ profit, salary, filing, state?, adminCost?, llcFees? }) → { payrollTaxes, employerFica, futa, suta, entityTax, k1, qbi, incomeTax, stateTax, total }
K.compare({...}) → { solo, scorp, savings } ; K.breakEven(0.4, { filing, adminCost }) ; K.ccorp({ profit, salary, filing, payout })
K.se(profit, filing?, w2?, '2026'|'2027') ; K.qbi({ qbi, taxableBeforeQbi, filing, sstb?, w2Paid? }) ; K.fed(taxable, filing) ; K.marginal(taxable, filing)
K.est({ expectedTax, priorTax, priorAgi, withholding, filing }) ; K.penalty([q1,q2,q3,q4]) ; K.homeOffice(sqft, homeSqft, costs) ; K.mileage(h1, h2)
K.retirement(profit, age) ; K.contractor(salary, benefits, hours) ; K.election('2027-01-01') ; K.llcYearly(s) ; K.llcCost(s, years)
K.usd(x) → "$1,234" ; K.cents(x) ; K.num(x) ; K.dec(72.5, 1) → "72.5" ; K.rate(0.153) → "15.3 %" ; K.day('2026-04-15') → "April 15, 2026"
```

**Un État dont le champ est `null` ou `verified: false` : on n'écrit pas le chiffre.** On écrit ce qui est
vérifié, et on renvoie à la page de l'agence (`h.ext`).

Dans `body(h)` : tout le kit, plus `h.a(id, texte)` (lien interne), `h.table(entêtes, lignes, légende, alignements)`,
`h.src(clé, texte)` (source de `params-2026.json`), `h.ext(url, texte)` (autre source officielle **lue**),
`h.box(titre, html)`, `h.mini(kind, arg)`.

Mini-simulateurs (`src/lib/mini-specs.ts`) : `seQuick`, `seWage`, `seHalf`, `se2027`, `total1099` (arg `{p}`),
`sideGig`, `setAside` (arg `{s: 'texas'}`), `invoice`, `quarter`, `safe110`, `lateQuarter`, `q4skip`, `qbiQuick`,
`qbiMin`, `qbiSstb`, `homeQuick`, `miles`, `dedValue`, `healthQuick`, `sepQuick`, `hourly`, `necCheck`, `schedC`,
`scorpQuick` (arg `{p, w, s}`), `scorpSalary`, `breakEvenQuick`, `payrollCost`, `ccorpQuick`, `doubleTax`, `fourWay`,
`llcFees` (arg `{s}`), `llcYears`, `deadline2553`, `llcSplit`, `stateGap` (arg `{a, b}`), `stateQuick` (arg `{s, p}`),
`localQuick` (arg `{l}`), `stateScorp` (arg `{s}`), `stateLlc` (arg `{s}`). **Un à deux par guide** (placé après le premier paragraphe du
corps, sur le sujet du paragraphe qui le précède) ; un par page d'État ou de ville, varié d'un État voisin à l'autre.
Le mini ne doit pas être le même outil que le calculateur de tête de la page.

## Ton et unicité

- Anglais américain, voix humaine, phrases de longueur variable, **le chiffre d'abord**. Pour un freelance ou un
  petit patron qui veut comprendre sans jargon (expliquer SE tax, QBI, K-1, safe harbor à leur première apparition).
- Interdits (le test les refuse) : tirets cadratin et demi-cadratin, « it's important to note », « dive into »,
  « delve », « whether you're », « navigate the », « Moreover », « Additionally », « Furthermore », « game changer »,
  « unlock », « 20XX ». Pas de triplets en série, pas de conclusion qui résume, pas d'émoji.
- **Unicité** (§6) : `check-unique` compare toutes les pages (texte hors tableaux et hors calculateur, chiffres
  neutralisés, seuil 30 %). Les pages d'État sont le risque principal : **ouvrir le corps sur ce que l'État a de
  plus rare** (franchise tax de 800 $ en Californie, publication des LLC à New York, margin tax du Texas, pas
  d'impôt sur le revenu, impôts de ville, PTET, frais biennaux, taxe minimale…), des titres `h2`/`h3` **propres à la
  page**, un vocabulaire différent d'une page à l'autre. Ne jamais reprendre une phrase d'une autre page.

## Contrôles

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/us-self-employed
PAGE_FILES=llc-vs-s-corp,state:texas npx vitest run tests/pages.test.ts   # vos pages
python3 scripts/sim-pages.py --only llc-vs-s-corp,state:texas              # similarité (difflib, comme check-unique)
npx vitest run                                                             # tout (moteur + pages)
export NODE_PATH=$(npm root -g):$PWD/node_modules
npm run build && S=~/Documents/GitHub/_trame/_template/scripts
python3 $S/check-seo.py . ; python3 $S/check-trame.py . ; python3 $S/check-unique.py dist
python3 $S/check-simulateurs.py . ; python3 $S/check-regles.py . ; python3 $S/check-portefeuille.py .
node $S/check-sources.mjs . ; node scripts/check-legal.mjs ; node $S/check-contraste.mjs dist
node $S/check-saisie.mjs dist --max=60 ; node $S/check-nombres.mjs dist ; node scripts/typo-nbsp.mjs dist --check
node scripts/check-premier-ecran.mjs . ; node scripts/check-url-propre.mjs . ; python3 scripts/check-cookies.py .
```

Serveur local : port **4382** (`npm run preview`), arrêter par le port (`lsof -ti tcp:4382 | xargs kill`),
jamais `pkill -f`.

## Mise à jour annuelle

1. Octobre : la SSA annonce le plafond de l'année suivante (fait : 192 300 $ pour 2027) ; octobre-novembre : la
   Rev. Proc. des ajustements de l'année suivante → `params-2027.json` (barèmes, déduction standard, QBI).
2. Décembre-janvier : Form 1040-ES de l'année, taux d'intérêt du 1er trimestre, barème kilométrique.
3. Toute l'année : frais des États (rejouer les fiches de `research/states/` et `python3 scripts/build-states.py`).
4. `npx vitest run`, puis tous les contrôles.

## Ce qu'on ne fait pas

- Pas de dépôt GitHub, pas de push, pas de DNS sans validation de l'éditeur.
- Ne pas toucher à `_trame` ni à la RECETTE ; suggestions dans le compte rendu.
- `CLARITY_ID` vide, aucune publicité tant que l'éditeur n'a pas décidé ; jamais de publicité d'un service de création
  de société.
