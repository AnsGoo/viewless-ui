import { describe, it, expect, vi } from 'vitest';
import { h, ref, shallowRef, isVNode, defineComponent } from 'vue';
import { renderComponent, toVNodes, type UiComponent, type Context } from '@viewless/core';

describe('renderComponent 函数测试', () => {
  it('应该正确渲染基本组件', () => {
    const mockComponent = { render: () => h('div', 'Test Component') };
    const option: UiComponent = {
      component: mockComponent,
      props: { id: 'test-component' },
      events: {},
      slots: {},
    };
    const context = {};

    const vnode = renderComponent(option, context);

    expect(vnode.type).toBe(mockComponent);
    expect(vnode.props).toEqual(expect.objectContaining({ id: 'test-component' }));
  });

  it('应该正确处理组件适配', () => {
    const mockComponent = { render: () => h('div', 'Original Component') };
    const adaptedComponent = { render: () => h('div', 'Adapted Component') };
    const option: UiComponent = {
      component: mockComponent,
      props: { id: 'test-component' },
      events: {},
      slots: {},
    };
    const adaptor = vi.fn((opt: UiComponent) => ({
      ...opt,
      component: adaptedComponent,
      props: { ...opt.props, adapted: true },
    }));
    const context = { adaptor, refMap: new Map() };

    const vnode = renderComponent(option, context);

    expect(adaptor).toHaveBeenCalledWith(option);
    expect(vnode.type).toBe(adaptedComponent);
    expect(vnode.props).toEqual(expect.objectContaining({ id: 'test-component', adapted: true }));
  });

  it('应该正确合并属性（vshow=false）', () => {
    const mockComponent = { render: () => h('div', 'Test Component') };
    const option: UiComponent = {
      component: mockComponent,
      props: { id: 'test-component', style: { color: 'red' } },
      events: {},
      slots: {},
      vshow: false,
      class: 'test-class',
    };
    const context = {};

    const vnode = renderComponent(option, context);

    expect(vnode.props).toEqual(
      expect.objectContaining({
        id: 'test-component',
        style: expect.objectContaining({ display: 'none' }),
        class: 'test-class',
      }),
    );
  });

  it('应该正确合并属性（vshow=true）', () => {
    const mockComponent = { render: () => h('div', 'Test Component') };
    const option: UiComponent = {
      component: mockComponent,
      props: { id: 'test-component', style: { color: 'red' } },
      events: {},
      slots: {},
      vshow: true,
      class: 'test-class',
    };
    const context = {};

    const vnode = renderComponent(option, context);

    expect(vnode.props).toEqual(
      expect.objectContaining({
        id: 'test-component',
        class: 'test-class',
      }),
    );
    expect(vnode.props?.style?.display).toBeUndefined();
  });

  it('应该正确处理响应式的vshow值', () => {
    const mockComponent = { render: () => h('div', 'Test Component') };
    const vshowRef = ref(false);
    const option: UiComponent = {
      component: mockComponent,
      props: { id: 'test-component' },
      events: {},
      slots: {},
      vshow: vshowRef,
    };
    const context = {};

    const vnode = renderComponent(option, context);

    expect(vnode.props).toEqual(
      expect.objectContaining({
        id: 'test-component',
        style: expect.objectContaining({ display: 'none' }),
      }),
    );
  });

  it('应该正确转换事件', () => {
    const mockComponent = { render: () => h('div', 'Test Component') };
    const clickHandler = vi.fn();
    const changeHandler = vi.fn();
    const option: UiComponent = {
      component: mockComponent,
      props: { id: 'test-component' },
      events: {
        click: clickHandler,
        change: changeHandler,
      },
      slots: {},
    };
    const context = {};

    const vnode = renderComponent(option, context);

    expect(vnode.props).toEqual(
      expect.objectContaining({
        onClick: clickHandler,
        onChange: changeHandler,
      }),
    );
  });

  it('应该正确转换插槽', () => {
    const mockComponent = { render: () => h('div', 'Test Component') };
    const option: UiComponent = {
      component: mockComponent,
      props: { id: 'test-component' },
      events: {},
      slots: {
        default: 'Default Slot Content',
        header: () => 'Header Slot Function',
      },
    };
    const context = {};

    const vnode = renderComponent(option, context);

    expect(typeof vnode.children).toBe('object');
    expect(vnode.children).toHaveProperty('default');
    expect(vnode.children).toHaveProperty('header');
    expect(typeof vnode.children.default).toBe('function');
    expect(typeof vnode.children.header).toBe('function');
  });

  it('应该正确处理ref属性', () => {
    const mockComponent = { render: () => h('div', 'Test Component') };
    const option: UiComponent = {
      component: mockComponent,
      props: { id: 'test-component' },
      events: {},
      slots: {},
      ref: 'test-ref',
    };
    const refMap = new Map();
    // 需要提供一个adaptor函数才能将ref添加到refMap中
    const adaptor = vi.fn((opt: UiComponent) => opt);
    const context = { refMap, adaptor };

    const vnode = renderComponent(option, context);

    expect(vnode.props).toEqual(expect.objectContaining({ ref: 'test-ref' }));
    expect(refMap.get('test-ref')).toBe(mockComponent);
  });

  it('应该正确处理ref类型的组件', () => {
    const mockComponent = { render: () => h('div', 'Test Component') };
    // 使用shallowRef而不是ref来避免Vue警告
    const componentRef = shallowRef(mockComponent);
    const option: UiComponent = {
      component: componentRef,
      props: { id: 'test-component' },
      events: {},
      slots: {},
    };
    const context = {};

    const vnode = renderComponent(option, context);

    expect(vnode.type).toBe(mockComponent);
  });

  it('应该正确处理字符串类型的组件', () => {
    const option: UiComponent = {
      component: 'div',
      props: { id: 'test-div' },
      events: {},
      slots: {},
      style: { color: 'blue' },
    };
    const context = {};

    const vnode = renderComponent(option, context);

    expect(vnode.type).toBe('div');
    expect(vnode.props).toEqual(
      expect.objectContaining({
        id: 'test-div',
        style: expect.objectContaining({ color: 'blue' }),
      }),
    );
  });

  it('应该正确处理数组类型的插槽内容', () => {
    const mockComponent = { render: () => h('div', 'Test Component') };
    const option: UiComponent = {
      component: mockComponent,
      props: { id: 'test-component' },
      events: {},
      slots: {
        content: ['Text 1', 'Text 2'],
      },
    };
    const context = {};

    const vnode = renderComponent(option, context);

    expect(typeof vnode.children).toBe('object');
    expect(vnode.children).toHaveProperty('content');
    expect(typeof vnode.children.content).toBe('function');
  });

  it('应该正确处理组件类型的插槽内容', () => {
    const mockComponent = defineComponent({ render: () => h('div', 'Test Component') });
    const slotComponent = defineComponent({ render: () => h('span', 'Slot Component') });
    const option: UiComponent = {
      component: mockComponent,
      props: { id: 'test-component' },
      events: {},
      slots: {
        content: {
          component: slotComponent,
        },
      },
    };
    const context = {};

    const vnode = renderComponent(option, context);

    expect(typeof vnode.children).toBe('object');
    expect(vnode.children).toHaveProperty('content');
    expect(typeof vnode.children.content).toBe('function');
  });

  it('应该正确处理update:modelValue事件', () => {
    const mockComponent = { render: () => h('div', 'Test Component') };
    const updateHandler = vi.fn();
    const option: UiComponent = {
      component: mockComponent,
      props: { id: 'test-component' },
      events: {
        'update:modelValue': updateHandler,
      },
      slots: {},
    };
    const context = {};

    const vnode = renderComponent(option, context);

    expect(vnode.props).toEqual(expect.objectContaining({ 'onUpdate:modelValue': updateHandler }));
  });

  it('应该正确处理嵌套组件', () => {
    const childComponent = { render: () => h('span', 'Child Component') };
    const parentComponent = { render: (props: any, { slots }: any) => h('div', slots.default()) };
    const option: UiComponent = {
      component: parentComponent,
      props: { id: 'parent' },
      events: {},
      slots: {
        default: { component: childComponent, props: {}, events: {}, slots: {} },
      },
    };
    const context = {};

    const vnode = renderComponent(option, context);

    expect(vnode.type).toBe(parentComponent);
    expect(vnode.props).toEqual(expect.objectContaining({ id: 'parent' }));
    expect(typeof vnode.children.default).toBe('function');
  });

  it('应该正确处理空的插槽内容', () => {
    const mockComponent = { render: () => h('div', 'Test Component') };
    const option: UiComponent = {
      component: mockComponent,
      props: { id: 'test-component' },
      events: {},
      slots: {
        empty: null,
      },
    };
    const context = {};

    const vnode = renderComponent(option, context);

    expect(typeof vnode.children).toBe('object');
    expect(vnode.children).toHaveProperty('empty');
    expect(typeof vnode.children.empty).toBe('function');
  });

  it('应该正确处理key属性', () => {
    const mockComponent = { render: () => h('div', 'Test Component') };
    const option: UiComponent = {
      component: mockComponent,
      props: { id: 'test-component' },
      events: {},
      slots: {},
      key: 'test-key',
    };
    const context = {};

    const vnode = renderComponent(option, context);

    expect(vnode.props).toEqual(expect.objectContaining({ key: 'test-key' }));
  });

  it('应该正确处理undefined事件', () => {
    const mockComponent = { render: () => h('div', 'Test Component') };
    const option: UiComponent = {
      component: mockComponent,
      props: { id: 'test-component' },
      events: {
        click: undefined,
        change: vi.fn(),
      },
      slots: {},
    };
    const context = {};

    const vnode = renderComponent(option, context);

    expect(vnode.props).toEqual(expect.objectContaining({ onChange: option.events.change }));
    expect(vnode.props).not.toHaveProperty('onClick');
  });
});

describe('toVNodes 函数测试', () => {
  const context: Context = {};

  it('应该处理 null 和 undefined 值', () => {
    expect(toVNodes(null, context)).toEqual([]);
    expect(toVNodes(undefined, context)).toEqual([]);
  });

  it('应该处理字符串和数字', () => {
    const stringResult = toVNodes('hello', context);
    const numberResult = toVNodes(123, context);
    const negativeNumberResult = toVNodes(-456, context);
    const zeroResult = toVNodes(0, context);

    expect(stringResult).toHaveLength(1);
    expect(stringResult[0]).toBe('hello');

    expect(numberResult).toHaveLength(1);
    expect(numberResult[0]).toBe('123');

    expect(negativeNumberResult).toHaveLength(1);
    expect(negativeNumberResult[0]).toBe('-456');

    expect(zeroResult).toHaveLength(1);
    expect(zeroResult[0]).toBe('0');
  });

  it('应该处理数组', () => {
    const result = toVNodes(['hello', 123, null, undefined], context);
    expect(result).toEqual(['hello', '123']);
  });

  it('应该处理嵌套数组', () => {
    const result = toVNodes(['hello', [123, ['world', 456]]], context);
    expect(result).toEqual(['hello', '123', 'world', '456']);
  });

  it('应该处理组件配置对象', () => {
    const mockComponent = { render: () => h('div', 'Test Component') };
    const componentConfig = {
      component: mockComponent,
      props: { id: 'test-component' },
      events: {},
      slots: {},
    };

    const result = toVNodes(componentConfig, context);

    expect(result).toHaveLength(1);
    expect(isVNode(result[0])).toBe(true);
    expect(result[0].type).toBe(mockComponent);
  });

  it('应该处理带有render方法的对象', () => {
    const renderableObject = defineComponent({ render: () => h('div', 'Renderable Object') });
    const result = toVNodes(renderableObject, context);

    expect(result).toHaveLength(1);
    expect(isVNode(result[0])).toBe(true);
    expect(result[0].type).toBe(renderableObject);
  });

  it('应该处理VNode', () => {
    const vnode = h('div', 'Test VNode');
    const result = toVNodes(vnode, context);

    expect(result).toHaveLength(1);
    expect(isVNode(result[0])).toBe(true);
    expect(result[0]).toBe(vnode);
  });

  it('应该处理返回值的函数', () => {
    const stringFn = () => 'hello from function';
    const numberFn = () => 789;
    const nullFn = () => null;

    expect(toVNodes(stringFn, context)).toEqual(['hello from function']);
    expect(toVNodes(numberFn, context)).toEqual(['789']);
    expect(toVNodes(nullFn, context)).toEqual([]);
  });

  it('应该处理返回组件配置的函数', () => {
    const mockComponent = { render: () => h('div', 'Test Component') };
    const componentConfigFn = () => ({
      component: mockComponent,
      props: { id: 'test-component' },
      events: {},
      slots: {},
    });

    const result = toVNodes(componentConfigFn, context);

    expect(result).toHaveLength(1);
    expect(isVNode(result[0])).toBe(true);
    expect(result[0].type).toBe(mockComponent);
  });

  it('应该处理其他类型', () => {
    const booleanResult = toVNodes(true, context);
    const falseResult = toVNodes(false, context);
    const objectResult = toVNodes({ key: 'value' }, context);

    expect(booleanResult).toEqual(['true']);
    expect(falseResult).toEqual(['false']);
    expect(objectResult).toEqual(['[object Object]']);
  });

  it('应该处理混合类型的数组', () => {
    const mockComponent = { render: () => h('div', 'Test Component') };
    const vnode = h('span', 'Test VNode');

    const result = toVNodes(
      [
        'string',
        123,
        null,
        { component: mockComponent, props: {}, events: {}, slots: {} },
        vnode,
        () => 'function result',
        [456, 'nested string'],
      ],
      context,
    );

    expect(result).toHaveLength(7);
    expect(result[0]).toBe('string');
    expect(result[1]).toBe('123');
    expect(isVNode(result[2])).toBe(true);
    expect(result[2].type).toBe(mockComponent);
    expect(result[3]).toBe(vnode);
    expect(result[4]).toBe('function result');
    expect(result[5]).toBe('456');
    expect(result[6]).toBe('nested string');
  });
});
