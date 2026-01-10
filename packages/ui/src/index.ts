import { useForm, useFormItem } from './components/form';
import { useInput } from './components/input';
import { useCard } from './components/card';
import { useButton } from './components/button';
import type { FormHandler } from './components/form';
import { useAdaptor as useAntDesignAdaptor } from './adaptor/ant-design';
import { useAdaptor as useElementPlusAdaptor } from './adaptor/element-plus';
import { useAdaptor as useNaiveUiAdaptor } from './adaptor/naive-ui';

export {
  useForm,
  useFormItem,
  useInput,
  useCard,
  useButton,
  useAntDesignAdaptor,
  useElementPlusAdaptor,
  useNaiveUiAdaptor,
};
export type { FormHandler };
