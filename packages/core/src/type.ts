import type { BaseAttrs, ComponentOption, Events, Props, Slots } from './render';

/**
 * 辅助类型：将字符串首字母大写
 */
type Capitalize<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S;

/**
 * 辅助类型：将事件名转换为 onEventName 格式
 * 例如：change -> onChange, update:modelValue -> onUpdate:modelValue
 */
type ToEventProperty<E extends Events> = {
  [K in keyof E as K extends string ? `on${Capitalize<K>}` : never]?: E[K];
};

/**
 * 辅助类型：将插槽名转换为 SlotNameSlot 格式
 * 例如：default -> defaultSlot, header -> headerSlot
 */
type ToSlotProperty<S extends Slots> = {
  [K in keyof S as K extends string ? `${K}Slot` : never]?: S[K];
};

/**
 * 辅助类型：将 BaseAttrs 中的属性加上 $ 前缀
 * 例如：key -> $key, vshow -> $vshow
 */
type ToAttrsProperty<A extends BaseAttrs> = {
  [K in keyof A as K extends string ? `$${K}` : never]: A[K];
};

/**
 * 辅助类型：直接映射属性类型，并给 BaseAttrs 属性加上 $ 前缀
 */
type ToPropsProperty<P extends Props> = {
  [K in keyof P]: P[K];
} & Partial<ToAttrsProperty<BaseAttrs>>;

/**
 * FlatOption<T> - 扁平化组件选项类型
 *
 * 接受一个泛型参数 T，T应该是一个包含 props、events、slots 属性的类型
 * 生成一个扁平化的类型，其中：
 * - props 中的属性直接映射，BaseAttrs 属性会自动加上 $ 前缀
 * - events 中的属性转换为 onEventName 格式
 * - slots 中的属性转换为 SlotNameSlot 格式
 * - BaseAttrs 中的属性映射为 $key, $vshow
 *
 * @example
 * ```typescript
 * interface MyComponentOption extends ComponentOption {
 *   props: { value: string; placeholder?: string }
 *   events: { change: (value: string) => void; blur: () => void }
 *   slots: { default: any; prefix: any }
 * }
 *
 * type Flattened = FlatOption<MyComponentOption>
 * // 结果类型包含：
 *  interface Flattened {
 *    $key?: string;
 *    $vshow?: boolean;
 *    value?: string;
 *    placeholder?: string;
 *    onChange?: (value: string) => void;
 *    onBlur?: () => void;
 *    defaultSlot?: any;
 *    prefixSlot?: any;
 *  }
 * ```
 */
export type FlatOption<T extends ComponentOption> =
  T extends ComponentOption<infer P, infer E, infer S>
    ? BaseAttrs & ToPropsProperty<P> & ToEventProperty<E> & ToSlotProperty<S>
    : T;

/**
 * 示例：Input 组件的扁平化选项类型
 * 这里假设 InputOption 是一个包含 props、events、slots 的组件选项
 */
// type InputFlatOption = FlatOption<InputOption>

/**
 * 使用示例：
 * ```typescript
 * const inputOptions: InputFlatOption = {
 *   // Base attrs (加上 $ 前缀)
 *   $key: 'input1',
 *   $vshow: true,
 *
 *   // Props (直接映射)
 *   modelValue: '',
 *   placeholder: '请输入用户名',
 *   disabled: false,
 *
 *   // Events (转换为 onEventName 格式)
 *   onUpdateModelValue: (value: string) => {
 *     console.log('值更新了：', value);
 *   },
 *   onBlur: () => {
 *     console.log('失去焦点');
 *   },
 *   onFocus: () => {
 *     console.log('获得焦点');
 *   },
 *
 *   // Slots (转换为 SlotNameSlot 格式)
 *   defaultSlot: '默认内容',
 *   prefixSlot: '前缀内容',
 *   suffixSlot: '后缀内容',
 * };
 * ```
 */
