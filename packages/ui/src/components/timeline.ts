import type {
  Props,
  Events,
  Slots,
  ViewlessComponent,
  BaseAttrs,
  FlatOption,
} from '@viewless/core';
import { useViewlessComponentOption } from '@viewless/core';


export interface TimelineItemProps extends Props {
  lineType?: 'default' | 'dashed';
  type?: 'default' | 'success' | 'info' | 'warning' | 'error';
  time?: boolean;
  title?: string;
  content?: string;
}

export interface TimelineItemEvents extends Events {}

export interface TimelineItemSlots extends Slots {
  default?: ViewlessComponent;
  icon?: ViewlessComponent;
  footer?: ViewlessComponent;
  header?: ViewlessComponent ;
}

export interface TimelineProps extends Props {
  horizontal?: boolean;
  direction?: 'left' | 'right';
  size?: 'small' | 'medium' | 'large' | 'huge';
}

export interface TimelineEvents extends Events {
}

export interface TimelineSlots extends Slots {
  default?: ViewlessComponent;
}

export interface TimelineOption extends BaseAttrs {
  props: TimelineProps;
  events: TimelineEvents;
  slots: TimelineSlots;
}
export function useTimeline(option: FlatOption<TimelineOption>) {
  return useViewlessComponentOption('Timeline', option);
}
