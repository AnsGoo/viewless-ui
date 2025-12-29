# Viewless - 声明式Vue 3无模板组件库

Viewless是一个创新的Vue 3组件库，采用声明式编程范式，让你无需编写Vue模板即可创建复杂的组件。它提供了一套简洁的API，通过JavaScript/TypeScript对象配置来定义组件的结构、属性、事件和插槽。

## 核心特性

- 🎯 **声明式组件定义** - 使用JavaScript对象配置组件，无需编写.vue模板文件
- 🔧 **完整的TypeScript支持** - 提供完整的类型定义，智能代码提示
- 🧩 **灵活的嵌套组件** - 支持任意层级的组件嵌套
- 🎨 **事件处理** - 自动转换事件命名（click → onClick）
- 📦 **多种内容类型** - 支持字符串、数字、数组、函数等作为插槽内容
- 🔄 **响应式集成** - 与Vue 3响应式系统无缝集成

## 快速开始

### 安装

```bash
# 使用pnpm（推荐）
pnpm add viewless

# 或使用npm
npm install viewless

# 或使用yarn
yarn add viewless
```

### 基本用法

```typescript
import { defineViewlessComponent } from 'viewless';
import { NButton } from 'naive-ui';

// 定义一个简单的按钮组件
const MyButton = defineViewlessComponent({
  setup: () => {
    return {
      component: NButton,
      props: {
        type: 'primary',
        size: 'large',
      },
      events: {
        click: () => {
          console.log('按钮被点击了！');
        },
      },
      slots: {
        default: '点击我',
      },
    };
  },
});

// 在模板中使用
// <MyButton />
```

### 嵌套组件

```typescript
// 定义卡片组件
const MyCard = defineViewlessComponent({
  setup: () => {
    return {
      component: NCard,
      props: {
        title: '标题',
      },
      slots: {
        default: '卡片内容',
        footer: '卡片底部',
      },
    };
  },
});

// 定义包含卡片的复杂组件
const ComplexComponent = defineViewlessComponent({
  setup: () => {
    return {
      component: 'div',
      props: {
        style: { padding: '20px' },
      },
      slots: {
        default: [
          {
            component: MyCard,
          },
          {
            component: NCard,
            props: {
              title: '第二个卡片',
            },
            slots: {
              default: '第二个卡片的内容',
            },
          },
        ],
      },
    };
  },
});
```

## API参考

### defineViewlessComponent

定义一个无模板组件，返回Vue 3组件定义。

```typescript
interface UiComponent {
  component: string | Component;
  key?: string | number | symbol;
  props?: Record<string, any>;
  events?: Record<string, (...args: any) => any>;
  slots?: Record<string, SlotContent>;
}

defineViewlessComponent({ setup: (props, context) => UiComponent }): Component
```

### SlotContent类型

插槽内容支持以下类型：

```typescript
type SlotContent =
  | string           // 文本内容
  | number           // 数字内容
  | boolean          // 布尔值
  | UiComponent      // 组件配置对象
  | SlotContent[]    // 数组（支持嵌套）
  | (() => SlotContent); // 函数（延迟渲染）
```

### 特殊属性

- `key`: 用于列表渲染时的唯一标识
- `show`: 布尔值，控制组件是否显示（false时设置display: none）

## 示例组件

本项目提供了丰富的示例组件，位于 `src/examples/` 目录下：

### 1. 简单div组件

展示最基本的组件定义，支持文本插槽。

### 2. 带事件的按钮

演示事件处理，监听原生DOM事件和自定义事件。

### 3. 卡片组件

使用Naive UI的NCard组件，展示props传递和多个插槽。

### 4. 折叠面板

演示复杂嵌套，折叠面板包含多个折叠项。

### 5. 数字插槽

展示数字作为插槽内容的用法。

### 6. 混合内容插槽

演示数组形式的插槽内容，混合文本、组件和函数。

### 7. 标签页组件

创建可复用的标签页组件。

### 8. 表单组件

展示响应式数据、生命周期钩子和计算属性的综合应用。

## 项目结构

```
viewless/
├── src/
│   ├── lib/
│   │   └── use-component.ts     # 核心组件定义逻辑
│   ├── examples/
│   │   ├── example-components.ts # 各种示例组件
│   │   └── form.ts              # 复杂表单示例
│   ├── App.vue                  # 主应用（包含所有示例）
│   └── main.ts
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 类型检查

```bash
pnpm type-check
```

### 代码格式化

```bash
pnpm fmt
```

### 代码检查

```bash
pnpm lint
```

## 与其他UI库集成

Viewless可以与任何Vue 3 UI库配合使用。以下是集成Naive UI的示例：

```typescript
import { defineViewlessComponent } from 'viewless';
import { NInput, NSelect, NDatePicker } from 'naive-ui';

const FormInput = defineViewlessComponent({
  setup: () => {
    return {
      component: NInput,
      props: {
        placeholder: '请输入',
      },
    };
  },
});

const FormSelect = defineViewlessComponent({
  setup: () => {
    return {
      component: NSelect,
      props: {
        options: [
          { label: '选项1', value: 1 },
          { label: '选项2', value: 2 },
        ],
      },
    };
  },
});
```

## 高级用法

### 动态组件

使用`shallowRef`包裹组件以获得更好的性能：

```typescript
import { shallowRef } from 'vue';
import { defineViewlessComponent } from 'viewless';
import { NCard } from 'naive-ui';

const DynamicCard = defineViewlessComponent({
  setup: () => {
    return {
      component: shallowRef(NCard),
      props: {
        title: '动态组件',
      },
    };
  },
});
```

### 响应式Props

使用Vue的响应式API：

```typescript
import { reactive, computed } from 'vue';
import { defineViewlessComponent } from 'viewless';

const ResponsiveComponent = defineViewlessComponent({
  setup: () => {
    const state = reactive({
      count: 0,
      visible: true,
    });

    const toggleVisible = () => {
      state.visible = !state.visible;
    };

    return {
      component: 'div',
      props: computed(() => ({
        style: {
          display: state.visible ? 'block' : 'none',
        },
      })),
      events: {
        click: toggleVisible,
      },
      slots: {
        default: `计数: ${state.count}`,
      },
    };
  },
});
```

## 许可证

MIT License
