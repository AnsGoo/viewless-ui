import type { Reactive, ToRefs } from 'vue';
import { isReactive, toRefs, toRaw } from 'vue';
import { Logger, LogLevel } from '@viewless/core';

const logger = new Logger('viewless/ui', {
  level: LogLevel.DEBUG,
});

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
  transform?: (props: T, shadowProps: Reactive<any>, warpValues: ToRefs<T>) => any,
) {
  let warpValues = obj as ToRefs<T>;
  let props = obj;
  const shadowProps: Record<string, any> = {};
  if (isReactive(obj)) {
    logger.warn('props obj must be plain object, but got reactive object', obj);
    props = toRaw(obj);
    warpValues = toRefs(obj);
    props = toRaw(obj);
  }

  if (transform) {
    transform(props, shadowProps, warpValues);
  } else {
    const props = obj || {};
    for (const key in props) {
      shadowProps[key] = props[key];
    }
  }

  return shadowProps;
}
