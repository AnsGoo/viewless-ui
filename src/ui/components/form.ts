import type { BaseAttrs, Events, Props, Slots, ViewlessComponent } from '@/lib/use-component';

export interface FormProps extends Props {
  modelValue: Record<string, any>;
  rules: Record<string, any>;
  inline?: boolean;
  size?: 'small' | 'medium' | 'large';
  labelPosition?: 'left' | 'right' | 'top';
}

export interface FormEvents extends Events {
  change: (value: Record<string, any>) => void;
}

export interface FormSlots extends Slots {
  default: ViewlessComponent;
}

export interface FormOption extends BaseAttrs {
  props: FormProps;
  events: FormEvents;
  slots: FormSlots;
}

export function useForm(options: FormOption) {
  const { props, events, slots } = options;
  return {
    component: 'Form',
    props,
    events,
    slots,
  };
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
  props?: FormItemProps;
  events?: FormItemEvents;
  slots?: FormItemSlots;
}

export interface FormItemSlots extends Slots {
  default?: ViewlessComponent;
  label?: ViewlessComponent;
}

export function useFormItem(options: FormItemOption) {
  const { props, events, slots } = options;
  return {
    component: 'FormItem',
    props,
    events,
    slots,
  };
}

export function useInput(options: FormItemOption) {
  const { props, events, slots } = options;
  return {
    component: 'Input',
    props,
    events,
    slots,
  };
}
