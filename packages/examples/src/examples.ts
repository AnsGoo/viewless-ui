import { defineViewlessComponent } from '@viewless/core';
import { NTabs, NTabPane } from 'naive-ui';
import { UseViewlessForm } from './form';
import { useProvideAdaptor, useViewlessComponentOption } from '@viewless/core';
import { useAntDesignAdaptor, useElementPlusAdaptor, useNaiveUiAdaptor } from '@viewless/ui';
import { onMounted, reactive, ref, toRef, watch } from 'vue';

export const ProxyCard = defineViewlessComponent({
  props: {
    ui: {
      type: String,
      default: 'naive-ui',
    },
  },
  setup: (props, _context) => {
    if (props.ui === 'naive-ui') {
      useProvideAdaptor(useNaiveUiAdaptor);
    } else if (props.ui === 'element-plus') {
      useProvideAdaptor(useElementPlusAdaptor);
    } else if (props.ui === 'ant-design') {
      useProvideAdaptor(useAntDesignAdaptor);
    }
    const titleMap: Record<string, string> = reactive({
      'naive-ui': 'NaiveUI 示例表单',
      'element-plus': 'Element Plus 示例表单',
      'ant-design': 'Ant Design 示例表单',
    });

    return useViewlessComponentOption('div', {
      defaultSlot: useViewlessComponentOption(UseViewlessForm(), {
        title: titleMap[props.ui] || 'Viewless UI 示例表单',
      }),
    });
  },
});

export const viewlessTabs = defineViewlessComponent({
  setup: (_props, _context) => {
    const activeTab = ref('naive-ui');
    onMounted(() => {
      setTimeout(() => {
        activeTab.value = 'element-plus';
      }, 1000);
    });
    return useViewlessComponentOption(NTabs, {
      type: 'line',
      value: activeTab,
      ['onUpdate:value']: (value: string) => {
        activeTab.value = value;
      },
      defaultSlot: [
        useViewlessComponentOption(NTabPane, {
          name: 'naive-ui',
          tab: 'Naive UI',
          $key: 'naive-ui',
          defaultSlot: useViewlessComponentOption(ProxyCard, {
              ui: 'naive-ui',
            }),
        }),
        useViewlessComponentOption(NTabPane, {
          name: 'element-plus',
          tab: 'Element Plus',
          $key: 'element-plus',
          defaultSlot: () => {
            return useViewlessComponentOption(ProxyCard, {
              ui: 'element-plus',
            });
          },
        }),
        useViewlessComponentOption(NTabPane, {
          name: 'ant-design',
          tab: 'Ant Design',
          $key: 'ant-design',
          defaultSlot: () => {
            return useViewlessComponentOption(ProxyCard, {
              ui: 'ant-design',
            });
          },
        }),
      ],
    });
  },
});

export const viewlessInput = defineViewlessComponent({
  setup: (_props, _context) => {
    const model = reactive({
      value: '123',
    });
    onMounted(() => {
      setTimeout(() => {
        model.value = '456';
      }, 2000);
    });
    watch(model, (newValue) => {
      console.log(newValue);
    });
    return useViewlessComponentOption('Input', {
      value: toRef(model, 'value'),
      ['onUpdate:value']: (value: string) => {
        model.value = value;
      },
    });
  },
});
