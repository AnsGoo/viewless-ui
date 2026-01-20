import { shallowRef } from 'vue';
import type { Component, TemplateRef } from 'vue';
import { NButton, NCard, NForm, NFormItem, NInput, NTabPane, NTabs } from 'naive-ui';
import type { UiComponent, Adaptor, AdaptorFn } from '@viewless-ui/core';
import type { FormOption, FormItemOption, FormHandler } from '../components/form';
import type { CardOption } from '../components/card';
import type { InputOption } from '../components/input';
import type { TabsOption, TabItemOption } from '../components/tabs';
import { transformEvents, transformProps } from '../utils';
import type { ButtonOption } from '../components/button';

function useFormAdaptor(opt: UiComponent<FormOption>) {
  opt.component = shallowRef(NForm);
  const shadowProps = transformProps(opt.props, (props, shadowProps, warpValues) => {
    for (const key in props) {
      if (key === 'modelValue') {
        shadowProps['model'] = warpValues[key];
      } else if (key === 'labelPosition') {
        shadowProps['labelPlacement'] = warpValues[key];
      } else {
        shadowProps[key] = warpValues[key];
      }
    }
  });
  return { ...opt, props: shadowProps } as UiComponent<FormOption>;
}

function useFormHandleAdaptor(refValue: TemplateRef['value'], prop: keyof FormHandler) {
  if (!refValue) {
    return refValue;
  }
  const formHandlers: FormHandler = {
    validate: async () => {
      try {
        const { warning } = await (refValue as Record<string, any>)['validate']();
        return !warning;
      } catch (_: any) {
        // eslint-disable-line @typescript-eslint/no-unused-vars
        return false;
      }
    },
    clearValidate: () => {
      (refValue as Record<string, any>)['restoreValidation']();
    },
  };
  if (formHandlers[prop]) {
    return formHandlers[prop];
  }
  return (refValue as FormHandler)[prop];
}

function useFormItemAdaptor(opt: UiComponent<FormItemOption>) {
  opt.component = shallowRef(NFormItem);
  const shadowProps = transformProps(opt.props, (props, shadowProps, warpValues) => {
    for (const key in props) {
      if (key === 'prop') {
        shadowProps['path'] = warpValues[key];
      } else if (key === 'required') {
        const rule = warpValues['rule'] as Record<string, any>;
        if (rule) {
          rule['required'] = warpValues[key];
          shadowProps['rule'] = rule;
        } else {
          shadowProps['rule'] = { required: warpValues[key] };
        }
      } else {
        shadowProps[key] = warpValues[key];
      }
    }
  });
  return { ...opt, props: shadowProps } as UiComponent<FormItemOption>;
}

function useInputAdaptor(opt: UiComponent<InputOption>) {
  opt.component = shallowRef(NInput);
  const shadowProps = transformProps(opt.props, (props, shadowProps, warpValues) => {
    for (const key in props) {
      if (key === 'modelValue') {
        shadowProps['value'] = warpValues[key];
      } else {
        shadowProps[key] = warpValues[key];
      }
    }
  });
  const shadowEvents = transformEvents(opt.events, (events, shadowEvents) => {
    for (const eventName in events) {
      if (eventName === 'update:modelValue') {
        shadowEvents['update:value'] = events[eventName];
      } else {
        shadowEvents[eventName] = events[eventName];
      }
    }
  });
  return { ...opt, props: shadowProps, events: shadowEvents } as UiComponent<InputOption>;
}

function useCardAdaptor(opt: UiComponent<CardOption>) {
  opt.component = shallowRef(NCard);
  return opt as UiComponent<CardOption>;
}

function useButtonAdaptor(opt: UiComponent<ButtonOption>) {
  opt.component = shallowRef(NButton);
  return opt as UiComponent<ButtonOption>;
}

function useTabsAdaptor(opt: UiComponent<TabsOption>) {
  opt.component = shallowRef(NTabs);
  return opt as UiComponent<TabsOption>;
}

function useTabItemAdaptor(opt: UiComponent<TabItemOption>) {
  opt.component = shallowRef(NTabPane);
  return opt as UiComponent<TabItemOption>;
}

export function useAdaptor(): ReturnType<AdaptorFn> {
  // 使用类型断言来放宽类型要求
  const adaptorMap: Record<string, Adaptor> = {
    Form: (opt: UiComponent) => useFormAdaptor(opt as UiComponent<FormOption>),
    FormItem: (opt: UiComponent) => useFormItemAdaptor(opt as UiComponent<FormItemOption>),
    Input: (opt: UiComponent) => useInputAdaptor(opt as UiComponent<InputOption>),
    Card: (opt: UiComponent) => useCardAdaptor(opt as UiComponent<CardOption>),
    Button: (opt: UiComponent) => useButtonAdaptor(opt as UiComponent<ButtonOption>),
    Tabs: (opt: UiComponent) => useTabsAdaptor(opt as UiComponent<TabsOption>),
    TabItem: (opt: UiComponent) => useTabItemAdaptor(opt as UiComponent<TabItemOption>),
  };

  type HandleAdaptorItemFn = (refValue: TemplateRef['value'], prop: string) => any;

  const handleAdaptorMap: Record<string, HandleAdaptorItemFn> = {
    Form: (refValue, prop: string) => useFormHandleAdaptor(refValue, prop as keyof FormHandler),
  };

  const adaptor = (opt: UiComponent) => {
    if (typeof opt.component !== 'string') {
      return opt;
    }
    const adaptorFn = adaptorMap[opt.component];
    if (adaptorFn) {
      return adaptorFn(opt);
    }
    return opt;
  };

  const handleAdaptor = (
    refValue: TemplateRef['value'],
    component: string | Component,
    prop: string,
  ) => {
    const handleAdaptorFn = handleAdaptorMap[component as string];
    if (handleAdaptorFn) {
      return handleAdaptorFn(refValue, prop);
    }
    return (refValue as any)[prop];
  };

  return {
    adaptorMap,
    adaptor,
    handleAdaptor,
  };
}
