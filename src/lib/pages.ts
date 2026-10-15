/** Registry: every file of src/content/{guides,states,local} is loaded here. */
import type { GuideDef, StateDef, LocalDef } from './page-types';
import { STATES } from './data';

const base = (file: string) => file.split('/').pop()!.replace(/\.ts$/, '');
const g = import.meta.glob<{ default: GuideDef }>(['../content/guides/*.ts', '!../content/guides/_*.ts'], { eager: true });
export const GUIDES: GuideDef[] = Object.entries(g).map(([f, m]) => {
  if (m.default.id !== base(f)) throw new Error(`${f}: id "${m.default.id}" differs from the file name`);
  return m.default;
}).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
export const guideById = (id: string) => GUIDES.find((p) => p.id === id);

const s = import.meta.glob<{ default: StateDef }>(['../content/states/*.ts', '!../content/states/_*.ts'], { eager: true });
export const STATE_PAGES: StateDef[] = Object.entries(s).map(([f, m]) => {
  if (m.default.slug !== base(f)) throw new Error(`${f}: slug "${m.default.slug}" differs from the file name`);
  if (!STATES.some((x) => x.slug === m.default.slug)) throw new Error(`${f}: unknown state`);
  return m.default;
}).sort((a, b) => a.slug.localeCompare(b.slug));
export const stateId = (slug: string) => `state:${slug}`;
export const statePageById = (id: string) => STATE_PAGES.find((p) => stateId(p.slug) === id);

const c = import.meta.glob<{ default: LocalDef }>(['../content/local/*.ts', '!../content/local/_*.ts'], { eager: true });
export const LOCAL_PAGES: LocalDef[] = Object.entries(c).map(([f, m]) => {
  if (`${m.default.state}--${m.default.place}` !== base(f)) throw new Error(`${f}: state--place differs from the file name`);
  return m.default;
}).sort((a, b) => a.state.localeCompare(b.state) || a.place.localeCompare(b.place));
export const localId = (state: string, place: string) => `local:${state}/${place}`;
export const localPageById = (id: string) => LOCAL_PAGES.find((p) => localId(p.state, p.place) === id);
export const localsOf = (state: string) => LOCAL_PAGES.filter((p) => p.state === state);
