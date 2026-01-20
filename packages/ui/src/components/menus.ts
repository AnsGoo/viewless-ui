import type {
  Props,
  Events,
  Slots,
  ViewlessComponent,
  BaseAttrs,
  FlatOption,
} from '@viewless-ui/core';
import { useViewlessComponentOption } from '@viewless-ui/core';

interface MenuOptionItem {
  label: string | ViewlessComponent;
  value: string;
  children?: MenuOptionItem[];
  disabled?: boolean;
  icon?: string | ViewlessComponent;
}

export interface MenuProps extends Props {
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'huge';
  accordion?: boolean;
  indent?: number;
  options?: MenuOptionItem[];
  mode?: 'vertical' | 'horizontal';
  value?: string;
  expandKeys?: string[];
  collapsed?: boolean;
}

export interface MenuEvents extends Events {
  ['update:value']: (value: string) => void;
  ['update:expandKeys']: (expandKeys: string[]) => void;
}

export interface MenuSlots extends Slots {}

export interface MenuOption extends BaseAttrs {
  props: MenuProps;
  events: MenuEvents;
  slots: MenuSlots;
}
export function useMenu(option: FlatOption<MenuOption>) {
  return useViewlessComponentOption('Menu', option);
}
