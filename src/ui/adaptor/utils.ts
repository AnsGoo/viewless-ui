import { toRefs } from 'vue';
import type { Reactive } from 'vue';

export function transfromProp(obj: Reactive<any>, from: string, to: string) {
  if (obj && obj[from]) {
    const warpValue = toRefs(obj)[from];
    obj[to] = warpValue;
  }
}
export function transfromEvent(obj: Reactive<any>, from: string, to: string) {
  if (obj && obj[from]) {
    const event = obj[from];
    delete obj[from];
    obj[to] = event;
  }
}
