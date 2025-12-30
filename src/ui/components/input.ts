import type { Events, Props, Slots, BaseAttrs, ViewlessComponent } from '@/lib/use-component';
import { transformFlatOption } from './transform';
import type { FlatOption } from './type';

export interface InputOption extends BaseAttrs {
  props?: InputProps;
  events?: InputEvents;
  slots?: InputSlots;
}
export interface InputProps extends Props {
  modelValue?: string;
  type?: 'text' | 'password' | 'textarea';
  placeholder?: string;
  clearable?: boolean;
  maxLength?: number;
  minLength?: number;
  readonly?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  rows?: number;
}
export interface InputEvents extends Events {
  change?: (value: string) => void;
  input?: (value: string) => void;
  focus?: (value: string) => void;
  blur?: (value: string) => void;
  'update:modelValue'?: (value: string) => void;
  clear?: () => void;
}
export interface InputSlots extends Slots {
  prefix?: ViewlessComponent | string | undefined;
  suffix?: ViewlessComponent | string | undefined;
}

export function useInput(option: FlatOption<InputOption>) {
  const { props, events, slots, ...kwargs } = transformFlatOption(option);
  return {
    component: 'Input',
    props,
    events,
    slots,
    ...kwargs,
  };
}
