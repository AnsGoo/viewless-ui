import type {
  Events,
  Props,
  Slots,
  BaseAttrs,
  ViewlessComponent,
  FlatOption,
} from '@viewless-ui/core';
import { useViewlessComponentOption } from '@viewless-ui/core';

export interface InputOption extends BaseAttrs {
  props: InputProps;
  events: InputEvents;
  slots: InputSlots;
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
  return useViewlessComponentOption('Input', option);
}
