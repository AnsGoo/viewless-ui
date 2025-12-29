import { capitalize, defineComponent, h, inject, isVNode } from 'vue';
import type { Component, VNode, Reactive } from 'vue';
import { ADAPTOR_KEY } from './const';

type SlotContent =
  | string
  | number
  | boolean
  | UiComponent
  | SlotContent[]
  | ((...args: any) => SlotContent);

type Event = (...args: any) => any;

export interface UiComponent {
  component: string | Component;
  key?: string | number | symbol;
  props?: Record<string, any>;
  events?: Record<string, (...args: any) => any>;
  slots?: Record<string, SlotContent>;
  vshow?: boolean;
}

export type ViewlessComponent = UiComponent | UiComponent[];

// 辅助函数：将任何值转换为 VNode 数组
function toVNodes(value: any, adaptor?: (opt: UiComponent) => UiComponent): VNode[] {
  if (value === null || value === undefined) {
    return [];
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    // 字符串或数字直接返回（Vue 会自动转换为文本节点）
    return [String(value) as any];
  } else if (Array.isArray(value)) {
    // 如果已经是数组，递归处理每个元素
    return value.flatMap((item) => toVNodes(item, adaptor));
  } else if (value && typeof value === 'object' && 'component' in value && !isVNode(value)) {
    // 组件配置对象，递归创建组件
    const ChildComponent = renderComponent(value as UiComponent, adaptor);
    const vnode = h(ChildComponent);
    return [vnode];
  } else if (value && isVNode(value)) {
    // 已经是 VNode，直接返回
    return [value as VNode];
  } else if (value && typeof value === 'function') {
    // 函数组件，直接调用
    return toVNodes(value(), adaptor);
  }
  return [];
}

function transformEvents(events: Record<string, Event>) {
  // 处理事件 - 将事件名转换为 Vue 事件处理格式
  const eventHandlers: Record<string, any> = {};
  for (const [eventName, handler] of Object.entries(events)) {
    if (typeof handler === 'function') {
      // 将事件名转换为驼峰式：click -> onClick, update:modelValue -> onUpdate:modelValue
      const camelCaseEventName = `on${capitalize(eventName)}`;
      eventHandlers[camelCaseEventName] = handler;
    }
  }
  return eventHandlers;
}

function transformSlot(
  slots: Record<string, any | any[]>,
  adaptor?: (opt: UiComponent) => UiComponent,
) {
  const slotFns: Record<string, () => VNode[]> = {};

  // 处理每个 slot
  for (const [slotName, slotValue] of Object.entries(slots)) {
    slotFns[slotName] = () => {
      // 使用改进的 toVNodes 函数处理所有类型的 slot 内容
      return toVNodes(slotValue, adaptor);
    };
  }
  return slotFns;
}

function mergeProps(attrs: Reactive<any> | Record<string, any>, kwargs: Reactive<any>) {
  const { key, vshow } = kwargs;
  if (key) {
    attrs.key = key;
  }

  // 移除样式配置
  attrs.style = {};
  // 移除类名配置
  if (attrs.class) {
    delete attrs.class;
  }
  if (typeof vshow !== 'undefined' && !vshow) {
    attrs.style.display = 'none';
  }
  return attrs;
}

export function renderComponent(
  option: UiComponent,
  adaptor?: (slotContent: UiComponent) => UiComponent,
): VNode | Component {
  let opt = option;
  if (adaptor) {
    opt = adaptor(opt);
  }
  const { component: Comp, props = {}, events = {}, slots = {}, ...kwargs } = opt;
  // 创建 slot 函数对象
  const innerProps = mergeProps(props, kwargs);
  const innerEvents = transformEvents(events);
  // 创建 slot 函数对象
  const innerSlots = transformSlot(slots, adaptor);
  return h(Comp, { ...innerProps, ...innerEvents }, innerSlots);
}

type InnerSetup = (props: Record<string, any>, context: any) => UiComponent;

export function defineViewlessComponent({ setup }: { setup: InnerSetup }): Component {
  return defineComponent({
    name: 'wrapper',
    setup(_props, context) {
      let resp = setup(_props, context);
      const adaptor = inject<(resp: UiComponent) => UiComponent>(ADAPTOR_KEY);
      if (adaptor) {
        resp = adaptor(resp);
      }
      if (resp.props) {
        //  不允许通过props 配置样式，移除样式相关的属性
        delete resp.props.style;
        delete resp.props.class;
      }
      return {
        component: resp.component,
        innerProps: resp.props || {},
        innerEvents: resp.events || {},
        innerSlots: resp.slots || {},
        adaptor,
      };
    },
    render() {
      const innerEvents = transformEvents(this.innerEvents || {});
      // 创建 slot 函数对象
      const innerSlots = transformSlot(this.innerSlots || {}, this.adaptor);
      const innerProps = mergeProps(this.innerProps || {}, {});
      // 渲染组件
      return h(this.component, { ...innerProps, ...innerEvents, ...this.$attrs }, innerSlots);
    },
  });
}
