import { defineComponent, h, isVNode, reactive, isReactive } from "vue";
import type { Component, VNode, Reactive } from "vue";

type SlotContent =
  | string
  | number
  | boolean
  | UiComponent
  | SlotContent[]
  | ((...args: any) => SlotContent);

type Event = (...args: any) => any;

interface InnerParam {
  props: Reactive<any>;
  events: Record<string, Event>;
}
export interface UiComponent {
  component?: string | Component;
  props?: Record<string, any>;
  events?: Record<string, (...args: any) => any>;
  slots?: Record<string, SlotContent>;
  setup?: (params: InnerParam, context: any) => InnerParam;
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
      const camelCaseEventName = `on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;
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

function mergeProps(props: Reactive<any> | Record<string, any>, innerProps: Reactive<any>) {
  console.log("原始 props:", props, innerProps);
  if (isReactive(props)) {
    Object.assign(props, innerProps);
  } else {
    Object.assign(reactive(props), innerProps);
  }
  console.log("合并后的 props:", props);
  return props;
}

export function useComponent(option: UiComponent): Component {
  const { component: Comp = "div", props = {}, events = {}, slots = {}, setup } = option;
  return defineComponent({
    name: "wrapper",
    setup(_props, context) {
      const __props = mergeProps(props, _props);
      if (setup) {
        const { props: innerProps, events: innerEvents } = setup({ props: __props, events }, context);
        return { innerProps, innerEvents };
      } else {
        return { innerProps: __props, innerEvents: events };
      }
    },
    render() {  
      const innerEvents = transformEvents(this.innerEvents);
      // 创建 slot 函数对象
      const innerSlots = transformSlot(slots);
      // 渲染组件 
      return h(Comp, { ...this.innerProps, ...innerEvents }, innerSlots);
    },
  });
}

export function renderComponent(option: UiComponent): VNode | Component {
  const { component: Comp = "div", props = {}, events = {}, slots = {} } = option;
  if (typeof Comp === "object") {
    // 创建 slot 函数对象
    const innerProps = mergeProps(props, reactive({}));
    console.log(innerProps);
    const innerEvents = transformEvents(events);
    // 创建 slot 函数对象
    const innerSlots = transformSlot(slots);
    return h(Comp, { ...innerProps, ...innerEvents }, innerSlots);
  }

  return useComponent(option);
}
