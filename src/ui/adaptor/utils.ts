import { toRef, toRefs } from 'vue';
import type { Reactive } from 'vue';

export function transfromProp(obj: Reactive<any>, from: string, to: string) {
  if (obj && obj[from]) {
    const warpValue = toRef(obj)[from];
    obj[to] = warpValue;
  }
}

export function transfromProps(obj: Reactive<any>, props: Record<string, string>) {
  const warpValues = toRefs(obj);
  for (const key in props) {
    const to = props[key];
    if (to && Object.prototype.hasOwnProperty.call(props, key)) {
      obj[to] = warpValues[key];
    }
  }
}
export function transfromEvent(obj: Reactive<any>, from: string, to: string) {
  if (obj && obj[from]) {
    const event = obj[from];
    delete obj[from];
    obj[to] = event;
  }
}
