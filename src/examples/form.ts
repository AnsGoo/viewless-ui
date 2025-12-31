import { computed, onMounted, reactive, ref, watch } from 'vue';
import {
  defineViewlessComponent,
  useViewlessTemplateRef,
  type UiComponent,
} from '@/lib/use-component.ts';
import { useCard, useFormItem, useInput, useForm } from '@/ui';

// 定义表单数据类型
interface FormModel {
  username: string;
  password: string;
}

export function UseViewlessForm() {
  return defineViewlessComponent({
    setup(_props, context) {
      const username = ref('123');
      const password = ref('');
      const model: FormModel = reactive({
        username,
        password,
      });

      const formRef = useViewlessTemplateRef('formRef');

      onMounted(() => {
        console.log('组件挂载完成');
        // console.log(model);
        model.username = '默认用户名';
        console.log('formRef.value', formRef.value?.validate);
        console.log('formRef.value.validate()', formRef.value?.validate());
      });

      watch(
        () => model.username,
        (newValue, oldValue) => {
          console.log('用户名变化了', newValue, oldValue);
          context.emit('change', model);
        },
      );

      watch(
        () => model.password,
        (newValue, oldValue) => {
          console.log('密码变化了', newValue, oldValue);
        },
      );

      return reactive<UiComponent>(
        useCard({
          $key: 'form-card',
          defaultSlot: useForm({
            modelValue: model,
            $ref: 'formRef',
            defaultSlot: [
              useFormItem({
                prop: 'username',
                label: '用户名',
                required: true,
                $key: 'username',
                defaultSlot: useInput({
                  modelValue: username,
                  placeholder: '请输入用户名',
                  'onUpdate:modelValue': (value: string) => {
                    console.log('用户名输入框值变化了', value);
                    model.username = value;
                  },
                }),
              }),
              useFormItem({
                prop: 'password',
                label: '密码',
                required: true,
                $key: 'password',
                $vshow: computed(() => model.username !== '1234'),
                defaultSlot: useInput({
                  modelValue: password,
                  placeholder: '请输入密码',
                  type: 'password',
                  'onUpdate:modelValue': (value: string) => {
                    console.log('密码输入框值变化了', value);
                    model.password = value;
                  },
                }),
              }),
            ],
          }),
        }),
      );
    },
  });
}
