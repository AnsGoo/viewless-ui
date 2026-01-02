import { toRef, toRefs } from 'vue';
import type { Reactive } from 'vue';

export function transformProp(obj: Reactive<any>, from: string, to: string) {
  if (obj && obj[from]) {
    const warpValue = toRef(obj, from);
    obj[to] = warpValue;
  }
}

export function transformProps(obj: Reactive<any>, props: Record<string, string>) {
  const warpValues = toRefs(obj);
  for (const key in props) {
    const to = props[key];
    if (to && Object.prototype.hasOwnProperty.call(props, key)) {
      obj[to] = warpValues[key];
    }
  }
}
export function transformEvent(
  obj: Reactive<any>,
  from: string,
  to: string,
  defaultFn?: (...args: any[]) => any,
) {
  if (obj && obj[from]) {
    const event = obj[from];
    obj[to] = defaultFn ? defaultFn : event;
  }
}
