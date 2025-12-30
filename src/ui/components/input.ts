import type { Events, Props, Slots, BaseAttrs } from '@/lib/use-component';

export interface InputOption extends BaseAttrs {
  props?: InputProps;
  events?: InputEvents;
  slots?: InputSlots;
}
export interface InputProps extends Props {
  modelValue?: string;
  type?: 'text' | 'password' | 'number' | 'email' | 'tel' | 'textarea';
  placeholder?: string;
}
export interface InputEvents extends Events {
  change?: (value: string) => void;
}
export interface InputSlots extends Slots {}

export function useInput(option: InputOption) {
  const { props, events, slots, ...kwargs } = option;
  return {
    component: 'Input',
    props,
    events,
    slots,
    ...kwargs,
  };
}
