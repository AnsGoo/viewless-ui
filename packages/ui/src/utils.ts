import { isReactive, toRaw } from 'vue';
import { Logger, LogLevel } from '@viewless-ui/core';

const logger = new Logger('viewless/ui', {
  level: LogLevel.DEBUG,
});

type ElementEvent = (...args: any[]) => any;

export function transformEvents<T extends object = Record<string, ElementEvent>>(
  events: T,
  transform?: (events: T, shadowEvents: Record<string, ElementEvent>) => any,
) {
  const shadowEvents: Record<string, ElementEvent> = {};
  if (transform) {
    transform(events, shadowEvents);
  } else {
    for (const [eventName, handler] of Object.entries(events)) {
      if (typeof handler === 'function') {
        shadowEvents[eventName] = handler;
      }
    }
  }
  return shadowEvents;
}

export function transformProps<T extends object = Record<string, any>>(
  obj: T,
  transform?: (props: T, shadowProps: Record<string, any>, warpValues: T) => any,
) {
  let warpValues = obj;
  let props = obj;
  const shadowProps: Record<string, any> = {};
  if (isReactive(obj)) {
    logger.warn('props obj must be plain object, but got reactive object', obj);
    warpValues = toRaw(obj);
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
