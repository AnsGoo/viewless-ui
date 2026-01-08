import { toRef, toRefs } from 'vue';
import type { Reactive, Ref, ToRefs } from 'vue';

export function transformProp(
  obj: Reactive<any>,
  from: string,
  to: string,
  transform?: (value: Ref<any>, obj?: Reactive<any>) => any,
) {
  if (obj && obj[from]) {
    const warpValue = toRef(obj, from);
    const value = transform?.(warpValue, obj) || warpValue;
    to ? (obj[to] = value) : null;
  }
}

export function transformProps<T extends object = Reactive<any>>(
  obj: T,
  props: Record<keyof T, string>,
  transform?: (value: Ref<any>, prop: string, obj?: ToRefs<T>) => any,
) {
  const warpValues = toRefs<T>(obj);
  for (const key in props) {
    const to = props[key];
    if (to && Object.prototype.hasOwnProperty.call(props, key)) {
      const value = transform?.(warpValues[key]!, key, warpValues) || warpValues[key]!
      to
        ? (obj[to as keyof T] = value)
        : null;
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
