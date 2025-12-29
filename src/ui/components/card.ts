import type { Props, Events, Slots, ViewlessComponent } from '@/lib/use-component';

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

export interface CardOption {
  props?: CardProps;
  events?: CardEvents;
  slots?: CardSlots;
}
export function useCard(options: CardOption) {
  const { props, events, slots } = options;
  return {
    component: 'Card',
    props,
    events,
    slots,
  };
}
