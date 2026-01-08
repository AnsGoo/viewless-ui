import { defineViewlessComponent } from '@/core/render';
import { NCard, NTabs, NTabPane, NCollapse, NCollapseItem, NButton } from 'naive-ui';
import { UseViewlessForm } from './form';
import { useAdaptor as useNaiveUiAdaptor } from '@/ui/adaptor/naive-ui.ts';
import { useProvideAdaptor } from '@/core/provide.ts';
import { useCard } from '@/ui';
import { useAdaptor as useElementPlusAdaptor } from '@/ui/adaptor/element-plus.ts';
import { useViewlessComponent } from '@/core/transform';
import { useAdaptor as useAntDesignAdaptor } from '@/ui/adaptor/ant-design.ts';
import { reactive } from 'vue';

// 示例1：简单的div组件
export const SimpleDiv = defineViewlessComponent({
  setup: (_props, _context) => {
    return {
      component: 'div',
      props: {
        style: { padding: '20px', border: '1px solid red', margin: '10px 0' },
      },
      slots: {
        default: '这是一个简单的div组件',
      },
    };
  },
});

// 示例2：带事件的按钮组件
export const EventButton = defineViewlessComponent({
  setup: (_props, _context) => {
    return {
      component: NButton,
      props: {
        type: 'primary',
        size: 'large',
      },
      events: {
        click: () => {
          alert('按钮被点击了！');
        },
      },
      slots: {
        default: '点击我',
      },
    };
  },
});

// 示例3：嵌套组件 - Card包含Tabs
export const CardWithTabs = defineViewlessComponent({
  setup: (_props, _context) => {
    return {
      component: NCard,
      props: {
        title: '卡片内的标签页222',
        style: { margin: '10px 0' },
      },
      slots: {
        default: '卡片内容',
        footer: '卡片底部',
        'header-extra': '卡片标题额外内容',
        action: '卡片操作按钮',
      },
    };
  },
});

// 示例4：复杂嵌套 - Collapse包含多个Item
export const ComplexCollapse = defineViewlessComponent({
  setup: (_props, _context) => {
    useProvideAdaptor(useNaiveUiAdaptor);
    const opt = {
      component: NCollapse,
      props: {
        accordion: true,
      },
      slots: {
        default: [
          {
            component: NCollapseItem,
            key: 'item1',
            props: {
              name: 'item1',
              title: '折叠项1',
            },
            slots: {
              default: UseViewlessForm,
            },
          },
          {
            component: NCollapseItem,
            key: 'item2',
            props: {
              name: 'item2',
              title: '折叠项2',
            },
            slots: {
              default: '这是折叠项2的内容',
            },
          },
        ],
      },
    };
    return opt;
  },
});

// 示例5：数字作为slot内容
export const NumberSlotExample = defineViewlessComponent({
  setup: (_props, _context) => {
    return {
      component: 'div',
      props: {
        style: { padding: '20px', border: '1px solid green', margin: '10px 0' },
      },
      slots: {
        default: 12345,
      },
    };
  },
});

// 示例6：混合内容的slot
export const MixedSlotExample = defineViewlessComponent({
  setup: (_props, _context) => {
    return {
      component: 'div',
      props: {
        style: { padding: '20px', border: '1px solid purple', margin: '10px 0' },
      },
      slots: {
        default: [
          () => '这是一段文本',
          {
            component: 'br',
          },
          '这是另一段文本',
        ],
      },
    };
  },
});

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

    const t =  useViewlessComponent('div',{
      defaultSlot: () =>
        useViewlessComponent(UseViewlessForm(), {
          title: titleMap[props.ui] || 'Viewless UI 示例表单',
        }),
    });
    console.log(t);
    return t
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
