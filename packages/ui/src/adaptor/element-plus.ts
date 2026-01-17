import { shallowRef, type Component, type TemplateRef } from 'vue';
import { ElButton, ElCard, ElForm, ElFormItem, ElInput } from 'element-plus';
import type { UiComponent, Adaptor, AdaptorFn } from '@viewless/core';
import type { FormOption, FormItemOption, FormHandler } from '../components/form';
import type { CardOption } from '../components/card';
import type { InputOption } from '../components/input';
import { transformProps } from '../utils';
import type { ButtonOption } from '../components/button';

function useFormAdaptor(opt: UiComponent<FormOption>) {
  opt.component = shallowRef(ElForm);
  const shadowProps = transformProps(opt.props, (props, shadowProps, warpValues) => {
    for (const key in props) {
      if (key === 'modelValue') {
        shadowProps['model'] = warpValues[key];
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
  opt.component = shallowRef(ElFormItem);
  return opt as UiComponent<FormItemOption>;
}

function useInputAdaptor(opt: UiComponent<InputOption>) {
  opt.component = shallowRef(ElInput);
  return opt as UiComponent<InputOption>;
}

function useCardAdaptor(opt: UiComponent<CardOption>) {
  opt.component = shallowRef(ElCard);
  const shadowProps = transformProps(opt.props, (props, shadowProps, warpValues) => {
    for (const key in props) {
      if (key === 'title') {
        shadowProps['header'] = warpValues[key];
      } else {
        shadowProps[key] = warpValues[key];
      }
    }
  });
  return { ...opt, props: shadowProps } as UiComponent<CardOption>;
}

function useButtonAdaptor(opt: UiComponent<ButtonOption>) {
  opt.component = shallowRef(ElButton);
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
