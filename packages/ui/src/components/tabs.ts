import type {
  Props,
  Events,
  Slots,
  ViewlessComponent,
  BaseAttrs,
  FlatOption,
} from '@viewless-ui/core';
import { useViewlessComponentOption } from '@viewless-ui/core';

export interface TabItemProps extends Props {
  lazy?: string;
  disabled?: boolean;
  name: string;
  title?: string;
}

export interface TabItemEvents extends Events {}

export interface TabItemSlots extends Slots {
  default?: ViewlessComponent;
  title?: ViewlessComponent;
}

export interface TabItemOption extends BaseAttrs {
  props: TabItemProps;
  events: TabItemEvents;
  slots: TabItemSlots;
}

export interface TabProps extends Props {
  size?: 'small' | 'medium' | 'large' | 'huge';
  type?: 'line' | 'bar' | 'card' | 'segment';
  name: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export interface TabsEvents extends Events {
  ['update:name']: (value: string) => void;
  itemClick: (name: string) => void;
}

export interface TabsSlots extends Slots {
  default?: ViewlessComponent;
  prefix?: ViewlessComponent;
  suffix?: ViewlessComponent;
}

export interface TabsOption extends BaseAttrs {
  props: TabProps;
  events: TabsEvents;
  slots: TabsSlots;
}
export function useTabs(option: FlatOption<TabsOption>) {
  return useViewlessComponentOption('Tabs', option);
}
