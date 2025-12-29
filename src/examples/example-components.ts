import { defineViewlessComponent } from '@/lib/use-component.ts';
import { NCard, NTabs, NTabPane, NCollapse, NCollapseItem, NButton } from 'naive-ui';

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
    return {
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
              default: '这是折叠项1的内容',
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

export const UiLessTabs = defineViewlessComponent({
  setup: (_props, _context) => {
    return {
      component: NTabs,
      props: {
        type: 'line',
      },
      slots: {
        default: [
          {
            component: NTabPane,
            props: {
              name: 'tab1',
              tab: '标签页1',
            },
            slots: {
              default: '这是标签页1的内容',
            },
          },
          {
            component: NTabPane,
            props: {
              name: 'tab2',
              tab: '标签页2',
            },
            slots: {
              default: '这是标签页2的内容',
            },
          },
        ],
      },
    };
  },
});
