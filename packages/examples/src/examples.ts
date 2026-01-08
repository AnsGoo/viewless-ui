import { defineViewlessComponent } from '@viewless/core';
import { NTabs, NTabPane } from 'naive-ui';
import { UseViewlessForm } from './form';
import { useProvideAdaptor, useViewlessComponent } from '@viewless/core';
import { useAntDesignAdaptor, useElementPlusAdaptor, useNaiveUiAdaptor } from '@viewless/ui';
import { reactive } from 'vue';

const ProxyCard = defineViewlessComponent({
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

    const t = useViewlessComponent('div', {
      defaultSlot: () =>
        useViewlessComponent(UseViewlessForm(), {
          title: titleMap[props.ui] || 'Viewless UI 示例表单',
        }),
    });
    console.log(t);
    return t;
  },
});

export const viewlessTabs = defineViewlessComponent({
  setup: (_props, _context) => {
    return useViewlessComponent(NTabs, {
      type: 'line',
      defaultSlot: [
        useViewlessComponent(NTabPane, {
          name: 'naive-ui',
          tab: 'Naive UI',
          $key: 'naive-ui',
          defaultSlot: () => {
            return useViewlessComponent(ProxyCard, {
              component: ProxyCard,
              ui: 'naive-ui',
            });
          },
        }),
        useViewlessComponent(NTabPane, {
          name: 'element-plus',
          tab: 'Element Plus',
          $key: 'element-plus',
          defaultSlot: () => {
            return useViewlessComponent(ProxyCard, {
              ui: 'element-plus',
            });
          },
        }),
        useViewlessComponent(NTabPane, {
          name: 'ant-design',
          tab: 'Ant Design',
          $key: 'ant-design',
          defaultSlot: () => {
            return useViewlessComponent(ProxyCard, {
              ui: 'ant-design',
            });
          },
        }),
      ],
    });
  },
});
