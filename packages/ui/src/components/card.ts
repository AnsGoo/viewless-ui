import type {
  Props,
  Events,
  Slots,
  ViewlessComponent,
  BaseAttrs,
  FlatOption,
} from '@viewless-ui/core';
import { useViewlessComponentOption } from '@viewless-ui/core';

export interface CardProps extends Props {
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'huge';
}

export interface CardEvents extends Events {}

export interface CardSlots extends Slots {
  default?: ViewlessComponent;
  title?: ViewlessComponent;
  footer?: ViewlessComponent;
  actions?: ViewlessComponent;
}

export interface CardOption extends BaseAttrs {
  props: CardProps;
  events: CardEvents;
  slots: CardSlots;
}
export function useCard(option: FlatOption<CardOption>) {
  return useViewlessComponentOption('Card', option);
}
