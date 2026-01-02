import {
  capitalize,
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  isVNode,
  shallowReadonly,
  useTemplateRef,
} from 'vue';
import type { Component, VNode, Reactive, TemplateRef } from 'vue';
import { ADAPTOR_KEY, HANDLE_ADAPTOR_KEY } from './const';

/**
 * 插槽内容类型定义
 * 支持字符串、数字、组件、组件数组、函数等多种内容类型
 */
export type SlotContent =
  | undefined
  | string
  | number
  | UiComponent
  | SlotContent[]
  | (() => SlotContent)
  | null; // 保留 null 用于显式清空插槽

type Event = ((...args: any) => any) | undefined;

// 保留原有的基础类型（用于向后兼容）
export interface Props {
  [key: string]: any;
}

export interface Events {
  [key: string]: Event;
}

export type Slots = Record<string, SlotContent>;

export type BaseAttrs = Pick<UiComponent, 'key' | 'vshow' | 'ref'>;

export type ComponentOption<
  P extends Props = Props,
  E extends Events = Events,
  S extends Slots = Slots,
> = {
  props: P;
  events: E;
  slots: S;
  key?: string | number | symbol;
  vshow?: boolean;
  ref?: string;
};

export interface UiComponent<O extends ComponentOption = ComponentOption> {
  component: string | Component;
  key?: string | number | symbol;
  props: O['props'];
  events: O['events'];
  slots: O['slots'];
  vshow?: boolean;
  ref?: string;
}

export type ViewlessComponent<O extends ComponentOption = ComponentOption> = UiComponent<O>;

// 辅助函数：将任何值转换为 VNode 数组
function toVNodes(value: any, context: Context): VNode[] {
  // 处理 null/undefined - 返回空数组
  if (value === null || value === undefined) {
    return [];
  }

  // 处理字符串和数字 - 转换为文本节点
  if (typeof value === 'string' || typeof value === 'number') {
    return [String(value) as any];
  }

  // 处理数组 - 递归处理每个元素
  if (Array.isArray(value)) {
    return value.flatMap((item) => toVNodes(item, context));
  }

  // 处理组件配置对象
  if (value && typeof value === 'object' && 'component' in value && !isVNode(value)) {
    const ChildComponent = renderComponent(value as UiComponent, context);
    const vnode = h(ChildComponent);
    return [vnode];
  }

  // 处理 VNode
  if (value && isVNode(value)) {
    return [value as VNode];
  }

  // 处理函数
  if (typeof value === 'function') {
    return toVNodes(value(), context);
  }

  // 其他类型转换为字符串
  return [String(value) as any];
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

function transformSlot(slots: Record<string, any | any[]>, context: Context) {
  const slotFns: Record<string, () => VNode[]> = {};

  // 处理每个 slot
  for (const [slotName, slotValue] of Object.entries(slots)) {
    slotFns[slotName] = () => {
      // 使用改进的 toVNodes 函数处理所有类型的 slot 内容
      return toVNodes(slotValue, context);
    };
  }
  return slotFns;
}

function mergeProps(attrs: Reactive<any> | Record<string, any>, kwargs: Reactive<any>) {
  const { key, vshow, ref, style } = kwargs;
  if (key) {
    attrs.key = key;
  }
  if (ref) {
    attrs.ref = ref;
  }

  // 移除样式配置
  attrs.style = {};
  Object.assign(attrs.style, style || {});
  // 移除类名配置
  if (attrs.class) {
    delete attrs.class;
  }
  attrs.class = kwargs.class || '';

  // 处理 vshow 属性，支持响应式值和计算属性
  if (typeof vshow !== 'undefined') {
    let isVisible = true;

    // 处理不同的响应式类型
    if (vshow && typeof vshow === 'object' && 'value' in vshow) {
      // Ref 或 ComputedRef
      isVisible = Boolean(vshow.value);
    } else if (typeof vshow === 'boolean') {
      // 静态布尔值
      isVisible = vshow;
    }

    if (!isVisible) {
      attrs.style.display = 'none';
    }
  }

  return attrs;
}

export type HandleAdaptor = (
  temRefValue: TemplateRef['value'],
  component: string | Component,
  prop: string,
) => any;
interface Context {
  attrs?: Record<string, any>;
  adaptor?: (slotContent: UiComponent) => UiComponent;
  refMap?: Map<string, string | Component>;
  handleAdaptor?: HandleAdaptor;
}

export function renderComponent(option: UiComponent, context: Context): VNode | Component {
  let opt = option;
  const { adaptor, attrs, refMap } = context;
  if (adaptor) {
    if (opt.ref && refMap) {
      refMap.set(opt.ref, opt.component);
    }
    opt = adaptor(opt);
  }
  const { component: Comp, props = {}, events = {}, slots = {}, ...kwargs } = opt;
  const innerProps = mergeProps(props, { ...kwargs, ...attrs });
  const innerEvents = transformEvents(events);
  // 创建 slot 函数对象
  const innerSlots = transformSlot(slots, { ...context, attrs: {} });
  return h(Comp, { ...innerProps, ...innerEvents }, innerSlots);
}

type InnerSetup = (props: Record<string, any>, context: any) => Reactive<UiComponent>;

export function defineViewlessComponent({
  name,
  props,
  setup,
}: {
  name?: string;
  props?: Record<string, any>;
  setup: InnerSetup;
}): Component {
  return defineComponent({
    name: name || 'wrapper',
    props,
    setup(_props, context) {
      const refMap = new Map<string, string | Component>();
      const opt = setup(_props, context);
      const adaptor = inject<(resp: UiComponent) => UiComponent>(ADAPTOR_KEY);
      const handleAdaptor = inject<HandleAdaptor>(HANDLE_ADAPTOR_KEY);
      if (opt.props) {
        //  不允许通过props 配置样式，移除样式相关的属性
        delete opt.props.style;
        delete opt.props.class;
      }
      return {
        option: opt,
        context: { adaptor, refMap, handleAdaptor },
      };
    },
    render() {
      const { option, context } = this;
      const { adaptor, refMap, handleAdaptor } = context;
      const attrs = this.$attrs;
      return renderComponent(option, {
        adaptor,
        refMap,
        attrs: {
          class: attrs.class,
          style: attrs.style,
        },
        handleAdaptor,
      });
    },
  });
}

export function useViewlessTemplateRef<T = unknown, Keys extends string = string>(
  key: Keys,
): TemplateRef<T> {
  const temRef = useTemplateRef<T>(key);
  const vm = getCurrentInstance()!.proxy;

  const proxyRef = shallowReadonly(
    new Proxy(temRef, {
      get(target, prop) {
        if (!target) {
          return target;
        }
        if (prop === 'value') {
          return new Proxy(target.value!, {
            get(obj: TemplateRef['value'], prop: string) {
              const { context } = (vm || {}) as any;
              const { refMap, handleAdaptor }: Context = context || {};
              if (refMap && refMap.get(key) && handleAdaptor) {
                const component = refMap.get(key);
                return handleAdaptor(obj, component!, prop);
              }
              return Reflect.get(obj as object, prop);
            },
          });
        }
        return Reflect.get(target, prop);
      },
    }),
  );
  return proxyRef;
}
