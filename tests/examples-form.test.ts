import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { UseViewlessForm } from '../packages/examples/src/form';
import { ADAPTOR_KEY, HANDLE_ADAPTOR_KEY } from '@viewless/core';
import {useNaiveUiAdaptor, useAntDesignAdaptor } from '@viewless/ui';
import { NButton } from 'naive-ui';


// 模拟console.log
global.console.log = vi.fn();

// 模拟window.matchMedia API
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // 兼容旧版API
    removeListener: vi.fn(), // 兼容旧版API
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('UseViewlessForm', () => {
  it('应该可以正确使用NaviteUI渲染组件', () => {
    const { adaptor, handleAdaptor}  = useNaiveUiAdaptor();
    const wrapper = mount(UseViewlessForm(), {
      global:{
        provide:{
          [ADAPTOR_KEY]: adaptor,
          [HANDLE_ADAPTOR_KEY]: handleAdaptor
        }
      }
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.n-card-header__main').exists()).toBe(true);
    expect(wrapper.findAll('.n-form-item').length).toBe(3);
    expect(wrapper.find('.n-form-item-label__text').text()).toBe('用户名');
    expect(wrapper.findComponent(NButton).props('type')).toBe('primary');
  });

  it('应该正确处理自定义标题', () => {
    const { adaptor, handleAdaptor}  = useAntDesignAdaptor();
    const wrapper = mount(UseViewlessForm(), { props: { title: '自定义表单标题' }, global:{
      provide:{
        [ADAPTOR_KEY]: adaptor,
        [HANDLE_ADAPTOR_KEY]: handleAdaptor
      }
    } });
    
    // 检查useCard是否被调用并传递了正确的标题
    expect(wrapper.find('.ant-card-head-title').text()).toBe('自定义表单标题');
    expect(wrapper.find('.n-card-header__main').exists()).toBe(false);
  });
});