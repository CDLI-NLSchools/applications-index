# Tagging Taxonomy — CDLI Applications Index

Source of truth for topic tags on application repos in the `CDLI-NLSchools` org.
Tags come from GitHub repo topics and flow into the index automatically via the
daily-refresh workflow. Grounded in the NL provincial curriculum (eNLightenED,
grades 4–12, verified October 2026).

## Format rules

- All tags are **lowercase** with **hyphens** instead of spaces: `bio-2201`, not `Bio2201` or `bio2201`.
- No special characters, no accents: `francais-1202`, not `français-1202`.
- Two levels:
  - **L1 — course tag (required).** Every curriculum-aligned app gets at least one
    course tag: the subject keyword + course number, e.g. `physics-2204`.
  - **L2 — unit/strand tag (recommended).** Narrows to the unit or strand the app
    targets, e.g. `kinematics`. Use the slugs listed below, not free text.
- Non-curriculum apps (e.g. `drivers-license`) keep a plain descriptive tag.
- Infrastructure repos (`applications-index`, `cdli-template-sim`, …) stay untagged.

## How to tag a new app

1. Find the course in the catalog below → add its L1 tag.
2. If the app targets a specific unit/strand, add the L2 slug.
3. Keep it to 1–3 tags. Course first, then unit.

Example: a projectile-motion sim for Physics 2204 →
`physics-2204`, `kinematics`.

## L1 course catalog

### Mathematics

| Course | L1 tag |
|---|---|
| Mathematics 4 | `math-4` |
| Mathematics 5 | `math-5` |
| Mathematics 6 | `math-6` |
| Mathematics 7 | `math-7` |
| Mathematics 8 | `math-8` |
| Mathematics 9 | `math-9` |
| Academic Mathematics 1201 | `math-1201` |
| Applied Mathematics 1202 | `math-1202` |
| Advanced Mathematics 2200 | `math-2200` |
| Academic Mathematics 2201 | `math-2201` |
| Applied Mathematics 2202 | `math-2202` |
| Academic Mathematics 3201 | `math-3201` |
| Advanced Mathematics 3200 | `math-3200` |
| Applied Mathematics 3202 | `math-3202` |
| Mathematics 3208 (Calculus) | `math-3208` |

### Science

| Course | L1 tag |
|---|---|
| Science 4 | `science-4` |
| Science 5 | `science-5` |
| Science 6 | `science-6` |
| Science 7 | `science-7` |
| Science 8 | `science-8` |
| Science 9 | `science-9` |
| Science 1206 | `science-1206` |
| Science 2200 | `science-2200` |
| Science 3200 | `science-3200` |
| Biology 2201 | `bio-2201` |
| Biology 3201 | `bio-3201` |
| Chemistry 2202 | `chem-2202` |
| Chemistry 3202 | `chem-3202` |
| Physics 2204 | `physics-2204` |
| Physics 3204 | `physics-3204` |
| Environmental Science 3205 | `env-science-3205` |
| Earth Systems 3209 | `earth-systems-3209` |

### English Language Arts

| Course | L1 tag |
|---|---|
| English Language Arts 4–9 | `ela-4` … `ela-9` |
| English 1201 / 1202 | `ela-1201`, `ela-1202` |
| English 2201 / 2202 | `ela-2201`, `ela-2202` |
| English 3201 / 3202 | `ela-3201`, `ela-3202` |
| Literacy 1204 | `literacy-1204` |
| Drama 2206 | `drama-2206` |
| Writing 2203 | `writing-2203` |
| Film Studies 3204 | `film-studies-3204` |
| World Literature 3207 | `world-literature-3207` |

### Core French

| Course | L1 tag |
|---|---|
| Core French 4–9 | `french-4` … `french-9` |
| Intensive Core French | `french-intensive` |
| Core French 1200 / 2200 / 3200 | `french-1200`, `french-2200`, `french-3200` |

### Français (French Immersion / FLP)

| Course | L1 tag |
|---|---|
| Français 4ᵉ–9ᵉ (FI) | `francais-4` … `francais-9` |
| Français 1202 / 2202 / 3202 (FI) | `francais-1202`, `francais-2202`, `francais-3202` |
| Français 4ᵉ–9ᵉ (FLP) | `francais-flp-4` … `francais-flp-9` |

### Social Studies

| Course | L1 tag |
|---|---|
| Social Studies 4–9 | `social-studies-4` … `social-studies-9` |
| Social Studies 1201 / 1202 | `social-studies-1201`, `social-studies-1202` |
| Social Studies 2201 / 2202 | `social-studies-2201`, `social-studies-2202` |
| Social Studies 3201 / 3202 | `social-studies-3201`, `social-studies-3202` |
| NL Studies 2205 | `nl-studies-2205` |

### Other subjects — course-level tags only

| Subject | Courses → L1 tags |
|---|---|
| Health | `health-4` … `health-9` |
| Physical Education | `phys-ed-4` … `phys-ed-9`, `phys-ed-2100`, `phys-ed-2101`, `phys-ed-3100`, `phys-ed-3101` |
| Religious Education | `rel-ed-4` … `rel-ed-9`, `ethics-2101`, `ethics-2106`, `world-religions-3101`, `world-religions-3106` |
| Visual Art | `art-4` … `art-9`, `art-1202`, `art-2202`, `art-3202` |
| Music | `music-4` … `music-9`, `ensemble-1105`, `ensemble-2105`, `ensemble-3105`, `applied-music-2206`, `applied-music-3206`, `experiencing-music-2200` |

## L2 unit / strand slugs

### Mathematics units

- **math-4:** `numeration`, `addition-subtraction`, `patterns`, `data-relationships`, `2d-geometry`, `multiplication-division-facts`, `fractions-decimals`, `multiplying-multi-digit`, `dividing-multi-digit`, `measurement`, `3d-geometry`
- **math-5:** `numeration`, `adding-subtracting-decimals`, `measurement`, `data-relationships`, `motion-geometry`, `multiplication`, `patterns`, `fractions`, `division`, `2d-3d-geometry`, `probability`
- **math-6:** `numeration`, `number-relationships`, `patterns`, `data-relationships`, `motion-geometry`, `ratio-percents`, `fractions`, `multiplication-division`, `measurement`, `2d-geometry`, `probability`
- **math-7:** `patterns-relations`, `integers`, `fractions-decimals-percents`, `circles-area`, `operations-fractions`, `equations`, `data-analysis`, `geometry`
- **math-8:** `square-roots-pythagorean`, `integers`, `operations-fractions`, `prisms-cylinders`, `percent-ratio-rate`, `linear-equations-graphing`, `data-analysis-probability`, `geometry`
- **math-9:** `rational-numbers`, `square-roots-surface-area`, `powers-exponents`, `polynomials`, `linear-equations-inequalities`, `linear-relations`, `similarity-transformations`, `circle-geometry`, `probability-statistics`
- **math-1201:** `measurement`, `roots-powers`, `factors-products`, `relations-functions`, `linear-functions`, `systems-linear-equations`, `trigonometry`
- **math-1202:** `consumerism-travel`, `measuring-length`, `measuring-area`, `getting-paid`, `angles`, `pythagorean-relation`, `trigonometry`
- **math-2200:** `trigonometry`, `quadratic-functions`, `quadratic-equations`, `radical-expressions`, `rational-expressions`, `absolute-value-functions`, `systems-equations`, `inequalities`, `sequences-series`
- **math-2201:** `acute-triangle-trigonometry`, `quadratic-functions`, `quadratic-equations`, `radicals`, `statistical-reasoning`, `proportional-reasoning`, `inductive-deductive-reasoning`, `angles-triangles`, `mathematics-inquiry`
- **math-2202:** `drawing-design`, `surface-area`, `volume-capacity`, `interpreting-graphs`, `budgets`, `banking`, `slope-scale`, `trigonometry`
- **math-3201:** `rational-expressions`, `polynomial-functions`, `sinusoidal-functions`, `exponential-functions`, `logarithmic-functions`, `financial-mathematics`, `set-theory`, `counting-methods`, `probability`
- **math-3200:** `polynomial-functions`, `function-transformations`, `radical-functions`, `unit-circle-trigonometry`, `trigonometric-functions-graphs`, `trigonometric-identities`, `exponential-functions`, `logarithmic-functions`, `permutations-combinations`
- **math-3202:** `measurement`, `linear-relationships`, `graphing-data`, `working-with-data`, `major-purchases`, `businesses-taxes`, `properties-figures`, `transformations`, `trigonometry`, `probability`
- **math-3208:** `pre-calculus`, `limits-continuity`, `rational-functions`, `derivatives`, `applications-derivatives`, `calculus-trigonometry`, `calculus-exponential-logarithmic`, `integration`

### Science units

- **science-4:** `rocks-minerals-erosion`, `sound`, `light`, `habitats-communities`
- **science-5:** `weather`, `forces-simple-machines`, `properties-changes-materials`, `body-systems`
- **science-6:** `space`, `flight`, `electricity`, `diversity-life`
- **science-7:** `ecosystems`, `heat`, `mixtures-solutions`, `earths-crust`
- **science-8:** `water-systems`, `fluids`, `optics`, `cells-tissues-organs`
- **science-9:** `space`, `atoms-elements-compounds`, `electricity`, `reproduction`
- **science-1206:** `weather-dynamics`, `chemical-reactions`, `motion`, `sustainability-ecosystems`
- **science-2200:** `ecosystems`, `weather-dynamics`
- **science-3200:** `chemical-reactions`, `motion-applications`
- **bio-2201:** `ecosystems-populations`, `processes-sustain-life`, `homeostasis`
- **bio-3201:** `cell-reproduction`, `heredity-genetics`, `evolution-biodiversity`
- **chem-2202:** `stoichiometry`, `structures-properties`, `organic-chemistry`
- **chem-3202:** `kinetics-equilibrium`, `acids-bases`, `thermochemistry`, `electrochemistry`
- **physics-2204:** `kinematics`, `dynamics`, `work-energy`, `waves`
- **physics-3204:** `motion`, `forces`, `fields`, `quantum-physics`
- **env-science-3205:** `intro-environmental-science`, `recreation-environment`, `land-use-environment`, `water-use-environment`, `atmosphere-environment`
- **earth-systems-3209:** `intro-earth-science`, `historical-geology`, `earth-materials`, `forces-within-earth`, `earth-resources`

### ELA / French / Social Studies strands (L2)

- **ELA** (`ela-*`, `literacy-1204`): `speaking-listening`, `reading-viewing`, `writing-representing`
- **Drama 2206:** `personal-growth`, `creative-expression`, `connections`
- **Core French:** `oral-communication`, `reading-viewing`, `written-communication`, `culture`, `general-language-education`
- **Français:** `ecoute-production-orale`, `lecture-visionnement`, `ecriture-representation`, `valorisation-langue`
- **Social Studies:** use unit slugs only where listed for the course in eNLightenED; otherwise course tag alone.

## Non-curriculum tags

Descriptive lowercase-hyphen tags for apps outside the curriculum, e.g.
`drivers-license`. Add the `non-curriculum` tag to any app that isn't tied to a
course, so it stays visibly separate from curriculum-tagged apps. Keep these
rare — prefer curriculum tags.

## Migrating old tags

| Old | New |
|---|---|
| `bio2201` | `bio-2201` |
| `physics3204` | `physics-3204` |
| `science1206` | `science-1206` |
| `science2200` | `science-2200` |
| `ecosystems-populations` | `ecosystems-populations` (unchanged) |
| `weather` | `weather` (unchanged) |
| `drivers-license` | `drivers-license` (unchanged) |

## Maintenance

- This file is the authority. When eNLightenED adds or renames a course, update
  the catalog here first, then retag affected repos.
- The daily-refresh workflow passes GitHub topics through unchanged — what you
  put in Topics is what the index shows. Keep topics within this taxonomy.
