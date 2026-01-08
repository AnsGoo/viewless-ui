import type { Props, Events, Slots, ViewlessComponent, BaseAttrs } from '@viewless/core/render';
import type { FlatOption } from '@viewless/core/type';
import { useViewlessComponent } from '@viewless/core/transform';

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
  props: CardProps;
  events: CardEvents;
  slots: CardSlots;
}
export function useCard(option: FlatOption<CardOption>) {
  return useViewlessComponent('Card', option);
}
