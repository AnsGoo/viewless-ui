import { toRef, toRefs } from 'vue';
import type { Reactive, Ref } from 'vue';

export function transformProp(
  obj: Reactive<any>,
  from: string,
  to: string,
  transform?: (value: any) => any,
) {
  if (obj && obj[from]) {
    const warpValue = toRef(obj, from);
    obj[to] = transform?.(warpValue.value) || warpValue.value;
  }
}

export function transformProps(
  obj: Reactive<any>,
  props: Record<string, string>,
  transform?: (value: any, prop: string) => any,
) {
  const warpValues = toRefs<Record<keyof typeof obj, Ref<any>>>(obj);
  for (const key in props) {
    const to = props[key];
    if (to && Object.prototype.hasOwnProperty.call(props, key)) {
      obj[to] = transform?.(warpValues[key]!.value, key) || warpValues[key]!.value;
    }
  }
}

export function transformEvent(
  obj: Reactive<any>,
  from: string,
  to: string,
  transform?: (...args: any[]) => any,
) {
  if (obj && obj[from]) {
    const event = obj[from];
    obj[to] = transform?.(event) || event;
  }
}
