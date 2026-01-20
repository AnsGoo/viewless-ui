import type {
  Props,
  Events,
  Slots,
  ViewlessComponent,
  BaseAttrs,
  FlatOption,
} from '@viewless-ui/core';
import { useViewlessComponentOption } from '@viewless-ui/core';

export interface CollapseItemProps extends Props {
  title?: string;
  disabled?: boolean;
  name: string;
}

export interface CollapseItemEvents extends Events {}

export interface CollapseItemSlots extends Slots {
  default?: ViewlessComponent;
  headerExtra?: ViewlessComponent;
}

export interface CollapseItemOption extends BaseAttrs {
  props: CollapseProps;
  events: CollapseEvents;
  slots: CollapseSlots;
}

export interface CollapseProps extends Props {
  names?: string[];
  arrowPlacement?: 'left' | 'right';
  accordion?: boolean;
}

export interface CollapseEvents extends Events {
  itemClick: (name: string) => void;
  ['update:names']: (name: string, value: boolean) => void;
}

export interface CollapseSlots extends Slots {
  default?: ViewlessComponent;
}

export interface CollapseOption extends BaseAttrs {
  props: CollapseProps;
  events: CollapseEvents;
  slots: CollapseSlots;
}
export function useCollapse(option: FlatOption<CollapseOption>) {
  return useViewlessComponentOption('Collapse', option);
}
