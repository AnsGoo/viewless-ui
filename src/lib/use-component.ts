import { capitalize, defineComponent, h, isVNode } from "vue";
import type { Component, VNode, Reactive } from "vue";

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
}

// 辅助函数：将任何值转换为 VNode 数组
function toVNodes(value: any): VNode[] {
  if (value === null || value === undefined) {
    return [];
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    // 字符串或数字直接返回（Vue 会自动转换为文本节点）
    return [String(value) as any];
  } else if (Array.isArray(value)) {
    // 如果已经是数组，递归处理每个元素
    return value.flatMap((item) => toVNodes(item));
  } else if (value && typeof value === "object" && "component" in value && !isVNode(value)) {
    // 组件配置对象，递归创建组件
    const ChildComponent = renderComponent(value as UiComponent);
    const vnode = h(ChildComponent);
    return [vnode];
  } else if (value && isVNode(value)) {
    // 已经是 VNode，直接返回
    return [value as VNode];
  } else if (value && typeof value === "function") {
    // 函数组件，直接调用
    return toVNodes(value());
  }
  return [];
}

function transformEvents(events: Record<string, Event>) {
  // 处理事件 - 将事件名转换为 Vue 事件处理格式
  const eventHandlers: Record<string, any> = {};
  for (const [eventName, handler] of Object.entries(events)) {
    if (typeof handler === "function") {
      // 将事件名转换为驼峰式：click -> onClick, update:modelValue -> onUpdate:modelValue
      const camelCaseEventName = `on${capitalize(eventName)}`;
      eventHandlers[camelCaseEventName] = handler;
    }
  }
  return eventHandlers;
}

function transformSlot(slots: Record<string, any | any[]>) {
  const slotFns: Record<string, () => VNode[]> = {};

  // 处理每个 slot
  for (const [slotName, slotValue] of Object.entries(slots)) {
    slotFns[slotName] = () => {
      // 使用改进的 toVNodes 函数处理所有类型的 slot 内容
      return toVNodes(slotValue);
    };
  }
  return slotFns;
}

function mergeProps(attrs: Reactive<any> | Record<string, any>, kwargs: Reactive<any>) {
  const { key, show } = kwargs;
  if (key) {
    attrs.key = key;
  }
  if (typeof show !== "undefined" && !show) {
    if (attrs.style) {
      attrs.style.display = "none";
    } else {
      attrs.style = { display: "none" };
    }
  }
  return attrs;
}

export function renderComponent(option: UiComponent): VNode | Component {
  const { component: Comp, props = {}, events = {}, slots = {}, ...kwargs } = option;
  // 创建 slot 函数对象
  const innerProps = mergeProps(props, kwargs);
  const innerEvents = transformEvents(events);
  // 创建 slot 函数对象
  const innerSlots = transformSlot(slots);
  return h(Comp, { ...innerProps, ...innerEvents }, innerSlots);
}

type InnerSetup = (props: Record<string, any>, context: any) => UiComponent;

export function defineViewlessComponent({ setup }: { setup: InnerSetup }): Component {
  return defineComponent({
    name: "wrapper",
    setup(_props, context) {
      const resp = setup(_props, context);
      return {
        component: resp.component,
        innerProps: resp.props,
        innerEvents: resp.events,
        innerSlots: resp.slots,
      };
    },
    render() {
      const innerEvents = transformEvents(this.innerEvents || {});
      // 创建 slot 函数对象
      const innerSlots = transformSlot(this.innerSlots || {});
      // 渲染组件
      return h(this.component, { ...this.innerProps, ...innerEvents }, innerSlots);
    },
  });
}
