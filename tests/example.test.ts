import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../src/App.vue';

describe('App Component', () => {
  it('should render correctly', () => {
    const wrapper = mount(App);
    expect(wrapper.exists()).toBe(true);
  });
});

describe('Basic Test', () => {
  it('should add numbers correctly', () => {
    expect(1 + 2).toBe(3);
  });
});
