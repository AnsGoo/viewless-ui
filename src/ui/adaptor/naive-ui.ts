import { shallowRef, toRef, type Component, type TemplateRef } from 'vue';
import { NCard, NForm, NFormItem, NInput } from 'naive-ui';
import type { UiComponent } from '@/core/render';
import type { FormOption, FormItemOption, FormHandler } from '@/ui/components/form';
import type { CardOption } from '@/ui/components/card';
import type { InputOption } from '../components/input';
import { transformEvent, transformProp } from './utils';
import type { Adaptor, AdaptorFn } from '../provide';

function useFormAdaptor(opt: UiComponent<FormOption>) {
  opt.component = shallowRef(NForm);
  transformProp(opt.props, 'modelValue', 'model');
  transformProp(opt.props, 'labelPosition', 'labelPlacement');
  const formITems = (opt.slots?.default) ||[]
  const rules = opt.props?.rules || {}
  formITems.forEach((item) => {
    const prop = item.props!.prop || '';
    if(!prop || !item.props!.required === undefined) {
      return;
    }
    if(rules[prop]) {
      if(rules[prop].required === undefined) {
        rules[prop]['required'] = toRef(item.props!, 'required');
      }
    } else {
      rules[prop] = {
        required: toRef(item.props!, 'required'),
        trigger: ['blur', 'change'],
      }
    }
  })
  opt.props!.rules = rules;
  return opt as UiComponent<FormOption>;
}

function useFormHandleAdaptor(refValue: TemplateRef['value'], prop: keyof FormHandler) {
  if (!refValue) {
    return refValue;
  }
  const formHandlers: FormHandler = {
    validate: async () => {
      try {
        const {warning} = await (refValue as Record<string, any>)['validate']();
        return !warning

      } catch (error) {
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
  opt.component = shallowRef(NFormItem);
  transformProp(opt.props, 'prop', 'path');
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

export function useAdaptor(): ReturnType<AdaptorFn> {
  // 使用类型断言来放宽类型要求
  const adaptorMap: Record<string, Adaptor> = {
    Form: (opt: UiComponent) => useFormAdaptor(opt as UiComponent<FormOption>),
    FormItem: (opt: UiComponent) => useFormItemAdaptor(opt as UiComponent<FormItemOption>),
    Input: (opt: UiComponent) => useInputAdaptor(opt as UiComponent<InputOption>),
    Card: (opt: UiComponent) => useCardAdaptor(opt as UiComponent<CardOption>),
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
