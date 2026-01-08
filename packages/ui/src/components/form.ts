import type {
  BaseAttrs,
  Events,
  Props,
  Slots,
  ViewlessComponent,
  FlatOption,
} from '@viewless/core';
import { useViewlessComponent } from '@viewless/core';

export interface FormProps extends Props {
  modelValue?: Record<string, any>;
  rules?: Record<string, any>;
  inline?: boolean;
  size?: 'small' | 'medium' | 'large';
  labelPosition?: 'left' | 'right' | 'top';
}

export interface FormEvents extends Events {}

export interface FormSlots extends Slots {
  default: ViewlessComponent[];
}

export interface FormOption extends BaseAttrs {
  props: FormProps;
  events: FormEvents;
  slots: FormSlots;
}

export function useForm(options: FlatOption<FormOption>) {
  return useViewlessComponent('Form', options);
}

export interface FormItemProps extends Props {
  prop: string;
  label?: string;
  labelPosition?: 'left' | 'right' | 'top';
  size?: 'small' | 'medium' | 'large';
  required?: boolean;
}

export interface FormItemEvents extends Events {}

export interface FormItemOption extends BaseAttrs {
  props: FormItemProps;
  events: FormItemEvents;
  slots: FormItemSlots;
}

export interface FormItemSlots extends Slots {
  default: ViewlessComponent[] | ViewlessComponent;
  label?: ViewlessComponent | string | undefined;
}

export function useFormItem(options: FlatOption<FormItemOption>) {
  return useViewlessComponent('FormItem', options);
}

export interface FormHandler {
  validate?: () => Promise<boolean>;
  clearValidate?: () => void;
}
