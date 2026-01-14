import type { Reactive, ToRefs } from 'vue';

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

export function transformProps<T extends object = Reactive<any>>(
  obj: T,
  transform: (props: T, shadowProps: Reactive<any>, warpValues: ToRefs<T>) => any,
) {
  const warpValues = obj as ToRefs<T>;
  const shadowProps = {};
  transform(obj, shadowProps, warpValues);
  return shadowProps;
}
