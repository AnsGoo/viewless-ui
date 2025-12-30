import type { Props, Events, Slots, ViewlessComponent, BaseAttrs } from '@/lib/use-component';
import type { FlatOption } from './type';
import { transformFlatOption } from './transform';

export interface CardProps extends Props {
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'huge';
}

export interface CardEvents extends Events {}

export interface CardSlots extends Slots {
  default?: ViewlessComponent;
  title?: ViewlessComponent;
  footer?: ViewlessComponent;
}

export interface CardOption extends BaseAttrs {
  props?: CardProps;
  events?: CardEvents;
  slots?: CardSlots;
}
export function useCard(options: FlatOption<CardOption>) {
  const { props, events, slots, ...kwargs } = transformFlatOption(options);
  return {
    component: 'Card',
    props,
    events,
    slots,
    ...kwargs,
  };
}
