import type { ViewlessComponent } from "@/lib/use-component";

interface FormProps {
  modelValue: Record<string, any>;
  rules: Record<string, any>;
  inline?: boolean;
  size?: "small" | "medium" | "large";
  labelPosition?: "left" | "right" | "top";
}
interface FormEvents {
  change: (value: Record<string, any>) => void;
}
interface FormSlots {
  default: ViewlessComponent;
}

interface FormOptions {
  props: FormProps;
  events: FormEvents;
}

export function useForm(options: FormOptions, slots: FormSlots) {
  const { props, events } = options;
  return {
    component: 'Form',
    props,
    events,
    slots,
  }
}

interface FormItemProps {
  prop: string;
  label?: string;
  labelPosition?: "left" | "right" | "top";
  size?: "small" | "medium" | "large";
}
interface FormItemOptions {
  props: FormItemProps;
  events: Record<string, any>;
}

interface FormItemSlots {
  default: ViewlessComponent;
  label: ViewlessComponent;
}

export function useFormItem(options: FormItemOptions, slots: FormItemSlots) {
  const { props, events } = options;
  return {
    component: 'FormItem',
    props,
    events,
    slots,
  }
}