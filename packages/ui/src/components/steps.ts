import type {
  Props,
  Events,
  Slots,
  ViewlessComponent,
  BaseAttrs,
  FlatOption,
} from '@viewless/core';
import { useViewlessComponentOption } from '@viewless/core';

export interface StepsItemProps extends Props {
  status?: 'process' | 'finish' | 'error' | 'wait';
  description?: string;
  disabled?: boolean;
  title?: string;
}

export interface StepsItemEvents extends Events {}

export interface StepsItemSlots extends Slots {
  default?: ViewlessComponent;
  title?: ViewlessComponent;
  icon?: ViewlessComponent;
}

export interface StepsProps extends Props {
  vertical?: boolean;
  current?: number;
  size?: 'small' | 'medium' | 'large' | 'huge';
}

export interface StepsEvents extends Events {
  ['update:current']: (value: number) => void;
}

export interface StepsSlots extends Slots {
  default?: ViewlessComponent;
}

export interface StepsOption extends BaseAttrs {
  props: StepsProps;
  events: StepsEvents;
  slots: StepsSlots;
}
export function useSteps(option: FlatOption<StepsOption>) {
  return useViewlessComponentOption('Steps', option);
}
