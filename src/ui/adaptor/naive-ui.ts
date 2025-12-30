import { shallowRef } from 'vue';
import { NCard, NForm, NFormItem, NInput } from 'naive-ui';
import type { UiComponent } from '@/lib/use-component';
import type { FormOption, FormItemOption } from '@/ui/components/form';
import type { CardOption } from '@/ui/components/card';
import type { InputOption } from '../components/input';
import { transfromProp } from './utils';

function useFormAdaptor(opt: UiComponent<FormOption>) {
  opt.component = shallowRef(NForm);
  transfromProp(opt.props, 'modelValue', 'model');
  transfromProp(opt.props, 'labelPosition', 'labelPlacement');
  return opt as UiComponent<FormOption>;
}

function useFormItemAdaptor(opt: UiComponent<FormItemOption>) {
  opt.component = shallowRef(NFormItem);
  transfromProp(opt.props, 'prop', 'path');
  return opt as UiComponent<FormItemOption>;
}

function useInputAdaptor(opt: UiComponent<InputOption>) {
  opt.component = shallowRef(NInput);
  transfromProp(opt.props, 'modelValue', 'value');
  return opt as UiComponent<InputOption>;
}

function useCardAdaptor(opt: UiComponent<CardOption>) {
  opt.component = shallowRef(NCard);
  return opt as UiComponent<CardOption>;
}

export function useAdaptor() {
  // 使用类型断言来放宽类型要求
  const adaptorMap: Record<string, (opt: UiComponent) => UiComponent> = {
    Form: (opt: UiComponent) => useFormAdaptor(opt as UiComponent<FormOption>),
    FormItem: (opt: UiComponent) => useFormItemAdaptor(opt as UiComponent<FormItemOption>),
    Input: (opt: UiComponent) => useInputAdaptor(opt as UiComponent<InputOption>),
    Card: (opt: UiComponent) => useCardAdaptor(opt as UiComponent<CardOption>),
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

  return {
    adaptorMap,
    adaptor,
  };
}
