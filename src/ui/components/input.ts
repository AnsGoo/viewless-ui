import type { Events, Props, UiComponent, ViewlessComponent, Slots } from '@/lib/use-component';
import { NInput } from 'naive-ui';
import { shallowRef } from 'vue';

export interface InputOption {
  props?: InputProps;
  events?: InputEvents;
  slots?: InputSlots;
}
export interface InputProps extends Props {
  modelValue: string;
  type?: 'text' | 'password' | 'number' | 'email' | 'tel' | 'textarea';
}
export interface InputEvents extends Events {
  change?: (value: string) => void;
}
export interface InputSlots extends Slots {
  default?: ViewlessComponent;
}

export function useInputAdaptor(opt: UiComponent<InputOption>) {
  opt.component = shallowRef(NInput);
  return opt;
}
