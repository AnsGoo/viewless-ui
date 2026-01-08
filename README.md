# Viewless - 声明式 Vue 3 无模板组件库

Viewless 是一个创新的 Vue 3 组件库，采用声明式编程范式，让你无需编写 Vue 模板即可创建复杂的组件。它提供了一套简洁的 API，通过 JavaScript/TypeScript 对象配置来定义组件的结构、属性、事件和插槽。

## 核心特性

- 🎯 **声明式组件定义** - 使用 JavaScript 对象配置组件，无需编写 .vue 模板文件
- 🔧 **完整的 TypeScript 支持** - 提供完整的类型定义，智能代码提示
- 🔄 **响应式集成** - 与 Vue 3 响应式系统无缝集成
- 🔌 **适配器模式** - 支持通过注入自定义适配器来统一转换组件配置
- 🎛 **属性安全** - 自动移除样式和类名配置，防止样式泄露
- 📦 **Monorepo 架构** - 模块化设计，Core、UI 和示例分离，便于扩展和维护
- 🔗 **多 UI 库支持** - 内置 Naive UI、Element Plus 和 Ant Design Vue 适配器

## Monorepo 架构

Viewless 采用 Monorepo 架构，使用 pnpm workspaces 管理多个包：

```
viewless/
├── packages/
│   ├── core/                  # 核心渲染逻辑和 API
│   │   ├── index.ts           # 主入口文件
│   │   ├── render.ts          # 渲染函数
│   │   ├── transform.ts       # 转换函数
│   │   ├── type.ts            # 类型定义
│   │   ├── provide.ts         # 依赖注入
│   │   └── const.ts           # 常量定义
│   ├── ui/                    # UI 组件和适配器
│   │   ├── adaptor/           # UI 库适配器
│   │   │   ├── naive-ui.ts    # Naive UI 适配器
│   │   │   ├── element-plus.ts # Element Plus 适配器
│   │   │   └── ant-design.ts  # Ant Design Vue 适配器
│   │   ├── components/        # 基础组件实现
│   │   │   ├── form.ts        # 表单组件
│   │   │   ├── input.ts       # 输入框组件
│   │   │   ├── button.ts      # 按钮组件
│   │   │   └── card.ts        # 卡片组件
│   │   └── index.ts           # UI 包入口
│   └── examples/              # 示例组件
│       ├── index.ts           # 示例包入口
│       ├── examples.ts        # 各种示例组件
│       └── form.ts            # 复杂表单示例
├── src/                       # 主应用
│   ├── App.vue                # 主应用组件
│   └── main.ts                # 应用入口
├── pnpm-workspace.yaml        # pnpm 工作区配置
├── package.json               # 根项目配置
├── tsconfig.json              # TypeScript 配置
└── vite.config.ts             # Vite 配置
```

## 快速开始

### 安装依赖

使用 pnpm 安装所有依赖：

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建项目

```bash
pnpm run build
```

## 核心包（@viewless/core）

Core 包提供了 ViewlessUI 的核心渲染逻辑和 API。

### 安装

```bash
pnpm add @viewless/core
```

### 基本用法

```typescript
import { useViewlessComponent } from '@viewless/core';
import { NButton } from 'naive-ui';

// 定义一个简单的按钮组件
const MyButton = useViewlessComponent({
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
});
```

## UI 包（@viewless/ui）

UI 包提供了基础组件和各种 UI 库的适配器。

### 安装

```bash
pnpm add @viewless/ui
```

### 组件使用

```typescript
import { ViewlessForm } from '@viewless/ui/components/form';
import { ViewlessInput } from '@viewless/ui/components/input';
import { ViewlessButton } from '@viewless/ui/components/button';
import { ViewlessCard } from '@viewless/ui/components/card';
```

### 适配器使用

```typescript
import { naiveUiAdaptor } from '@viewless/ui/adaptor/naive-ui';
import { elementPlusAdaptor } from '@viewless/ui/adaptor/element-plus';
import { antDesignAdaptor } from '@viewless/ui/adaptor/ant-design';

// 提供适配器
provide(ADAPTOR_KEY, naiveUiAdaptor);
```

## 示例包（@viewless/examples）

示例包提供了各种使用示例，帮助你快速上手 ViewlessUI。

### 安装

```bash
pnpm add @viewless/examples
```

### 使用示例组件

```typescript
import { ExampleComponents } from '@viewless/examples/examples';
import { FormExample } from '@viewless/examples/form';
```

## API 参考

### useViewlessComponent

创建一个无模板组件配置。

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

function useViewlessComponent(options: UiComponent): UiComponent;
```

### UiComponent 属性说明

| 属性        | 类型                                    | 说明                                          |
| ----------- | --------------------------------------- | --------------------------------------------- |
| `component` | `string  Component`                     | 组件本身，可以是 HTML 标签字符串或 Vue 组件   |
| `key`       | `string  number  symbol`                | 用于列表渲染时的唯一标识                      |
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

### 常量

```typescript
import { ADAPTOR_KEY } from '@viewless/core/const';
```

## 适配器模式

Viewless 支持通过适配器模式来统一转换组件配置。

### 使用内置适配器

```typescript
import { provide } from 'vue';
import { ADAPTOR_KEY } from '@viewless/core/const';
import { naiveUiAdaptor } from '@viewless/ui/adaptor/naive-ui';

// 提供 Naive UI 适配器
provide(ADAPTOR_KEY, naiveUiAdaptor);
```

### 创建自定义适配器

```typescript
import { provide } from 'vue';
import { ADAPTOR_KEY, type UiComponent } from '@viewless/core';

// 创建自定义适配器
const customAdaptor = (opt: UiComponent): UiComponent => {
  return {
    ...opt,
    // 统一添加全局属性
    props: {
      ...opt.props,
      size: opt.props?.size || 'medium',
    },
  };
};

// 提供适配器
provide(ADAPTOR_KEY, customAdaptor);
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

### 代码格式化

```bash
pnpm run fmt
```

### 代码检查

```bash
pnpm lint
```

### 构建所有包

```bash
pnpm run build
```

## 与其他 UI 库集成

ViewlessUI 可以与任何 Vue 3 UI 库配合使用。以下是集成示例：

### Naive UI

```typescript
import { useViewlessComponent } from '@viewless/core';
import { NInput, NSelect, NDatePicker } from 'naive-ui';
import { naiveUiAdaptor } from '@viewless/ui/adaptor/naive-ui';
import { provide } from 'vue';
import { ADAPTOR_KEY } from '@viewless/core/const';

// 提供适配器
provide(ADAPTOR_KEY, naiveUiAdaptor);

// 创建组件
const FormInput = useViewlessComponent({
  component: NInput,
  props: {
    placeholder: '请输入',
  },
});
```

### Element Plus

```typescript
import { useViewlessComponent } from '@viewless/core';
import { ElInput, ElSelect, ElDatePicker } from 'element-plus';
import { elementPlusAdaptor } from '@viewless/ui/adaptor/element-plus';
import { provide } from 'vue';
import { ADAPTOR_KEY } from '@viewless/core/const';

// 提供适配器
provide(ADAPTOR_KEY, elementPlusAdaptor);

// 创建组件
const FormInput = useViewlessComponent({
  component: ElInput,
  props: {
    placeholder: '请输入',
  },
});
```

## 高级用法

### 动态组件

```typescript
import { shallowRef } from 'vue';
import { useViewlessComponent } from '@viewless/core';
import { NCard } from 'naive-ui';

const DynamicCard = useViewlessComponent({
  component: shallowRef(NCard),
  props: {
    title: '动态组件',
  },
});
```

### 响应式 Props

```typescript
import { reactive, computed } from 'vue';
import { useViewlessComponent } from '@viewless/core';

const state = reactive({
  count: 0,
  visible: true,
});

const toggleVisible = () => {
  state.visible = !state.visible;
};

const ResponsiveComponent = useViewlessComponent({
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
    default: () => `计数: ${state.count}`,
  },
});
```

### 组件数组

```typescript
import { useViewlessComponent } from '@viewless/core';

const MultipleComponents = useViewlessComponent([
  {
    component: 'div',
    key: '1',
    props: { style: { color: 'red' } },
    slots: { default: '第一个组件' },
  },
  {
    component: 'div',
    key: '2',
    props: { style: { color: 'blue' } },
    slots: { default: '第二个组件' },
  },
]);
```

## 最佳实践

1. **使用 key 属性**：在渲染组件数组时，始终提供唯一的 key
2. **使用 shallowRef**：对于稳定的组件引用，使用 shallowRef 避免不必要的响应式转换
3. **合理使用 vshow**：对于需要频繁切换显示/隐藏的场景，使用 vshow 比条件渲染更高效
4. **利用适配器**：在大型项目中，使用适配器模式统一处理组件配置
5. **模块化设计**：利用 Monorepo 结构，根据功能划分模块，便于维护和扩展

## 许可证

MIT License
