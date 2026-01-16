import { shallowRef, type Component, isRef } from 'vue';
import type { ComponentOption, UiComponent } from './render';
import type { FlatOption } from './type';

function firstLetterToLowerCase(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function transformFlatOption<T extends ComponentOption>(flatOption: FlatOption<T>): T {
  const { $key, $vshow, $ref, vdirs, ...rest } = flatOption;
  const props = {} as T['props'];
  const events = {} as T['events'];
  const slots = {} as T['slots'];
  for (const key in rest) {
    const value = rest[key];
    if (key.startsWith('on')) {
      const eventName = firstLetterToLowerCase(key.replace('on', ''));
      (events as any)[eventName] = value;
    } else if (key.startsWith('$')) {
      delete rest[key];
    } else if (key.endsWith('Slot')) {
      const slotName = key.replace('Slot', '');
      (slots as any)[slotName] = value;
    } else {
      (props as any)[key] = value;
    }
  }
  return {
    key: $key,
    vshow: $vshow,
    ref: $ref,
    props,
    events,
    slots,
    vdirs,
  } as T;
}

export function useViewlessComponentOption<T extends ComponentOption>(
  component: string | Component,
  componentOption: FlatOption<T>,
): UiComponent<T> {
  const flatOption = transformFlatOption<T>(componentOption);
  const opt = {
    component:
      typeof component === 'string' || isRef(component) ? component : shallowRef(component),
    ...flatOption,
  };
  return opt as UiComponent<T>;
}
