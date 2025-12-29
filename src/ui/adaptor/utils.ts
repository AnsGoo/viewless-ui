import { toRefs } from 'vue';
import type { Reactive } from 'vue';

export function transfromProp(obj: Reactive<any>, from: string, to: string) {
  if (obj[from]) {
    const warpValue = toRefs(obj)[from];
    obj[to] = warpValue;
  }
}
