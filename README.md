# Viewless - 声明式 Vue 3 无模板组件库

Viewless 是一个创新的 Vue 3 组件库，采用声明式编程范式，让你无需编写 Vue 模板即可创建复杂的组件。它提供了一套简洁的 API，通过 JavaScript/TypeScript 对象配置来定义组件的结构、属性、事件和插槽。

## 核心特性

- 🎯 **声明式组件定义** - 使用 JavaScript 对象配置组件，无需编写 .vue 模板文件
- 🔧 **完整的 TypeScript 支持** - 提供完整的类型定义，智能代码提示
- 🧩 **灵活的嵌套组件** - 支持任意层级的组件嵌套
- 🎨 **事件处理** - 自动转换事件命名（click → onClick）
- 📦 **多种内容类型** - 支持字符串、数字、数组、函数等作为插槽内容
- 🔄 **响应式集成** - 与 Vue 3 响应式系统无缝集成
- 🔌 **适配器模式** - 支持通过注入自定义适配器来统一转换组件配置
- 🎛 **属性安全** - 自动移除样式和类名配置，防止样式泄露

## 快速开始

### 安装

```bash
# 使用 pnpm（推荐）
pnpm add viewless

# 或使用 npm
npm install viewless

# 或使用 yarn
yarn add viewless
```

### 基本用法

```typescript
import { defineViewlessComponent } from "viewless";
import { NButton } from "naive-ui";

// 定义一个简单的按钮组件
const MyButton = defineViewlessComponent({
  setup: () => {
    return {
      component: NButton,
      props: {
        type: "primary",
        size: "large",
      },
      events: {
        click: () => {
          console.log("按钮被点击了！");
        },
      },
      slots: {
        default: "点击我",
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
        title: "标题",
      },
      slots: {
        default: "卡片内容",
        footer: "卡片底部",
      },
    };
  },
});

// 定义包含卡片的复杂组件
const ComplexComponent = defineViewlessComponent({
  setup: () => {
    return {
      component: "div",
      props: {
        style: { padding: "20px" },
      },
      slots: {
        default: [
          {
            component: MyCard,
          },
          {
            component: NCard,
            props: {
              title: "第二个卡片",
            },
            slots: {
              default: "第二个卡片的内容",
            },
          },
        ],
      },
    };
  },
});
```

## API 参考

### defineViewlessComponent

定义一个无模板组件，返回 Vue 3 组件定义。

```typescript
interface UiComponent {
  component: string | Component;
  key?: string | number | symbol;
  props?: Record<string, any>;
  events?: Record<string, (...args: any) => any>;
  slots?: Record<string, SlotContent>;
  vshow?: boolean;
}

type ViewlessComponent = UiComponent | UiComponent[];

defineViewlessComponent({ setup: (props, context) => UiComponent }): Component
```

### UiComponent 属性说明

| 属性        | 类型                                    | 说明                                          |
| ----------- | --------------------------------------- | --------------------------------------------- |
| `component` | `string \| Component`                   | 组件本身，可以是 HTML 标签字符串或 Vue 组件   |
| `key`       | `string \| number \| symbol`            | 用于列表渲染时的唯一标识                      |
| `props`     | `Record<string, any>`                   | 组件的属性配置                                |
| `events`    | `Record<string, (...args: any) => any>` | 事件处理函数，会自动转换为 on 开头格式        |
| `slots`     | `Record<string, SlotContent>`           | 插槽内容配置                                  |
| `vshow`     | `boolean`                               | 控制组件显示/隐藏，false 时设置 display: none |

### SlotContent 类型

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
- `vshow`: 布尔值，控制组件是否显示（false 时设置 display: none）

## 适配器模式

Viewless 支持通过适配器模式来统一转换组件配置。这在你需要统一处理组件样式、属性映射或添加全局逻辑时非常有用。

### 创建适配器

```typescript
import { defineViewlessComponent, ADAPTOR_KEY } from "viewless";
import { provide, inject } from "vue";

// 创建适配器函数
const createAdaptor = () => {
  return (opt: UiComponent): UiComponent => {
    // 统一处理组件配置
    return {
      ...opt,
      // 可以添加全局默认属性
      props: {
        ...opt.props,
      },
    };
  };
};

// 在应用中提供适配器
provide(ADAPTOR_KEY, createAdaptor());
```

### 使用适配器

所有通过 `defineViewlessComponent` 创建的组件都会自动应用适配器：

```typescript
import { defineViewlessComponent, ADAPTOR_KEY } from "viewless";
import { provide, inject } from "vue";

// 提供适配器
provide(ADAPTOR_KEY, (opt) => {
  // 添加全局前缀
  if (typeof opt.props?.style === "object") {
    opt.props.style = {
      ...opt.props.style,
    };
  }
  return opt;
});

// 组件会自动应用适配器
const MyComponent = defineViewlessComponent({
  setup: () => {
    return {
      component: "div",
      props: {
        style: { color: "red" },
      },
      slots: {
        default: "内容",
      },
    };
  },
});
```

## 示例组件

本项目提供了丰富的示例组件，位于 `src/examples/` 目录下：

### 1. 简单 div 组件

展示最基本的组件定义，支持文本插槽。

### 2. 带事件的按钮

演示事件处理，监听原生 DOM 事件和自定义事件。

### 3. 卡片组件

使用 Naive UI 的 NCard 组件，展示 props 传递和多个插槽。

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
│   │   ├── const.ts              # 常量定义（适配器 key）
│   │   └── use-component.ts      # 核心组件定义逻辑
│   ├── examples/
│   │   ├── example-components.ts # 各种示例组件
│   │   └── form.ts               # 复杂表单示例
│   ├── ui/
│   │   ├── adaptor/              # 适配器实现
│   │   └── components/           # 基础组件
│   ├── App.vue                   # 主应用（包含所有示例）
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

## 与其他 UI 库集成

Viewless 可以与任何 Vue 3 UI 库配合使用。以下是集成 Naive UI 的示例：

```typescript
import { defineViewlessComponent } from "viewless";
import { NInput, NSelect, NDatePicker } from "naive-ui";

const FormInput = defineViewlessComponent({
  setup: () => {
    return {
      component: NInput,
      props: {
        placeholder: "请输入",
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
          { label: "选项1", value: 1 },
          { label: "选项2", value: 2 },
        ],
      },
    };
  },
});
```

## 高级用法

### 动态组件

使用 `shallowRef` 包裹组件以获得更好的性能：

```typescript
import { shallowRef } from "vue";
import { defineViewlessComponent } from "viewless";
import { NCard } from "naive-ui";

const DynamicCard = defineViewlessComponent({
  setup: () => {
    return {
      component: shallowRef(NCard),
      props: {
        title: "动态组件",
      },
    };
  },
});
```

### 响应式 Props

使用 Vue 的响应式 API：

```typescript
import { reactive, computed } from "vue";
import { defineViewlessComponent } from "viewless";

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
      component: "div",
      props: computed(() => ({
        style: {
          display: state.visible ? "block" : "none",
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

### 组件数组

支持返回组件数组来渲染多个根元素：

```typescript
const MultipleComponents = defineViewlessComponent({
  setup: () => {
    return [
      {
        component: "div",
        key: "1",
        props: { style: { color: "red" } },
        slots: { default: "第一个组件" },
      },
      {
        component: "div",
        key: "2",
        props: { style: { color: "blue" } },
        slots: { default: "第二个组件" },
      },
    ] as ViewlessComponent;
  },
});
```

## 最佳实践

1. **使用 key 属性**：在渲染组件数组时，始终提供唯一的 key
2. **使用 shallowRef**：对于稳定的组件引用，使用 shallowRef 避免不必要的响应式转换
3. **合理使用 vshow**：对于需要频繁切换显示/隐藏的场景，使用 vshow 比条件渲染更高效
4. **利用适配器**：在大型项目中，使用适配器模式统一处理组件配置

## 许可证

MIT License
