import { shallowRef } from 'vue';
import type { Component, TemplateRef } from 'vue';
import { NButton, NCard, NForm, NFormItem, NInput } from 'naive-ui';
import type { UiComponent } from '@/core/render';
import type { FormOption, FormItemOption, FormHandler } from '@/ui/components/form';
import type { CardOption } from '@/ui/components/card';
import type { InputOption } from '@/ui/components/input';
import { transformEvent, transformProp } from '@/ui/components/utils';
import type { Adaptor, AdaptorFn } from '@/core/provide';
import type { ButtonOption } from '../components/button';

function useFormAdaptor(opt: UiComponent<FormOption>) {
  opt.component = shallowRef(NForm);
  transformProp(opt.props, 'modelValue', 'model');
  transformProp(opt.props, 'labelPosition', 'labelPlacement');
  return opt as UiComponent<FormOption>;
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
      } catch (_) {
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
  transformProp(opt.props, 'prop', 'path');
  transformProp(opt.props, 'required', '', (required) => {
    if (required.value === undefined) {
      return;
    }
    if (opt.props.rule) {
      opt.props.rule.required = required;
    } else {
      opt.props.rule = { required: required };
    }
  });
  return opt as UiComponent<FormItemOption>;
}

function useInputAdaptor(opt: UiComponent<InputOption>) {
  opt.component = shallowRef(NInput);
  transformProp(opt.props, 'modelValue', 'value');
  transformEvent(opt.events, 'update:modelValue', 'update:value');
  return opt as UiComponent<InputOption>;
}

function useCardAdaptor(opt: UiComponent<CardOption>) {
  opt.component = shallowRef(NCard);
  return opt as UiComponent<CardOption>;
}

function useButtonAdaptor(opt: UiComponent<ButtonOption>) {
  opt.component = shallowRef(NButton);
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
