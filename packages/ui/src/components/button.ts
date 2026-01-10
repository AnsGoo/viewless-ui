import type { Events, Props, Slots, BaseAttrs, ViewlessComponent } from '@viewless/core';
import type { FlatOption } from '@viewless/core';
import { useViewlessComponentOption } from '@viewless/core';

export interface ButtonOption extends BaseAttrs {
  props: ButtonProps;
  events: ButtonEvents;
  slots: ButtonSlots;
}
export interface ButtonProps extends Props {
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}
export interface ButtonEvents extends Events {
  click?: (e: MouseEvent) => void;
}
export interface ButtonSlots extends Slots {
  default?: ViewlessComponent | string | undefined;
}

export function useButton(option: FlatOption<ButtonOption>) {
  return useViewlessComponentOption('Button', option);
}
