import { shallowRef, isRef, computed, toValue } from 'vue';
import { Button, Card, Form, FormItem, Input } from 'ant-design-vue';
import type { Component, TemplateRef } from 'vue';
import type { UiComponent } from '@viewless/core';
import type { FormOption, FormItemOption, FormHandler } from '../components/form';
import type { CardOption } from '../components/card';
import type { InputEvents, InputOption } from '../components/input';
import { transformEvents } from '../components/utils';
import type { Adaptor, AdaptorFn } from '@viewless/core';
import type { ButtonOption } from '../components/button';
import { transformProps } from '../components/utils';

function useFormAdaptor(opt: UiComponent<FormOption>) {
  opt.component = shallowRef(Form);
  const shadowProps = transformProps(opt.props, (props, shadowProps, warpValues) => {
    for (const key in props) {
      if (key === 'modelValue') {
        shadowProps['model'] = warpValues[key];
      } else if (key === 'labelPosition') {
        const positionValue = warpValues[key];
        const getPostion = () => (toValue(positionValue) === 'top' ? 'vertical' : 'horizontal');
        shadowProps['layout'] = isRef(positionValue) ? computed(getPostion) : getPostion();
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
        await (refValue as Record<string, any>)['validate']();
      } catch (_: any) {
        // eslint-disable-line @typescript-eslint/no-unused-vars
        return false;
      }
      return true;
    },
  };
  if (formHandlers[prop]) {
    return formHandlers[prop];
  }
  return (refValue as FormHandler)[prop];
}

function useFormItemAdaptor(opt: UiComponent<FormItemOption>) {
  opt.component = shallowRef(FormItem);
  const shadowProps = transformProps(opt.props, (props, shadowProps, warpValues) => {
    for (const key in props) {
      if (key === 'prop') {
        shadowProps['name'] = warpValues[key];
      } else {
        shadowProps[key] = warpValues[key];
      }
    }
  });
  return { ...opt, props: shadowProps } as UiComponent<FormItemOption>;
}

function useInputAdaptor(opt: UiComponent<InputOption>) {
  opt.component = shallowRef(Input);
  const shadowEvents = transformEvents<InputOption['events']>(
    opt.events,
    (events, shadowEvents) => {
      for (const eventName in events) {
        if (eventName === 'update:modelValue') {
          shadowEvents['update:value'] = events[eventName];
        } else {
          shadowEvents[eventName] = events[eventName];
        }
      }
    },
  );
  const shadowProps = transformProps(opt.props, (props, shadowProps, warpValues) => {
    for (const key in props) {
      if (key === 'modelValue') {
        shadowProps['value'] = warpValues[key];
      } else {
        shadowProps[key] = warpValues[key];
      }
    }
  });
  return { ...opt, props: shadowProps, events: shadowEvents } as UiComponent<InputOption>;
}

function useCardAdaptor(opt: UiComponent<CardOption>) {
  opt.component = shallowRef(Card);
  return opt as UiComponent<CardOption>;
}

function useButtonAdaptor(opt: UiComponent<ButtonOption>) {
  opt.component = shallowRef(Button);
  return opt as UiComponent<ButtonOption>;
}

export function useAdaptor(): ReturnType<AdaptorFn> {
  // 使用类型断言来放宽类型要求
  const adaptorMap: Record<string, Adaptor> = {
    Form: (opt: UiComponent) => useFormAdaptor(opt as UiComponent<FormOption>),
    FormItem: (opt: UiComponent) => useFormItemAdaptor(opt as UiComponent<FormItemOption>),
    Input: (opt: UiComponent) => useInputAdaptor(opt as UiComponent<InputOption>),
    Card: (opt: UiComponent) => useCardAdaptor(opt as UiComponent<CardOption>),
    Button: (opt: UiComponent) => useButtonAdaptor(opt as UiComponent<ButtonOption>),
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
