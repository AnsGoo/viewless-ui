import { describe, it, expect, vi } from 'vitest';
import { h, ref, shallowRef } from 'vue';
import { renderComponent, type UiComponent } from '../packages/core/src/render';

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
    const mockComponent = { render: () => h('div', 'Test Component') };
    const slotComponent = { render: () => h('span', 'Slot Component') };
    const option: UiComponent = {
      component: mockComponent,
      props: { id: 'test-component' },
      events: {},
      slots: {
        content: slotComponent,
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
