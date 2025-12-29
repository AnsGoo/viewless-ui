import { computed, onMounted, reactive, ref, watch } from 'vue';
import { defineViewlessComponent } from '@/lib/use-component.ts';
import { useFormItem, useInput } from '@/ui';

export function UseForm() {
  return defineViewlessComponent({
    setup(_props, context){
      const username = ref('123');
      const password = ref('');
      const model = reactive({
        username,
        password,
      });
      onMounted(() => {
        console.log('组件挂载完成');
        console.log(model);
        model.username = '默认用户名';
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
      return reactive({
        component: 'Card',
        slots: {
          default: {
            component: 'Form',
            props: reactive({
              model: model,
            }),
            slots: {
              default: [
                useFormItem({
                  props: reactive({
                    prop: 'username',
                    label: '用户名',
                    required: true,
                  }),
                  key: 'username',
                  slots: {
                    default: useInput({
                      props: {
                        modelValue: username,
                        placeholder: '请输入用户名',
                        onUpdateValue: (value: string) => {
                          console.log(value);
                          model.username = value;
                        },
                      },
                    }),
                  },
                }),
                useFormItem({
                  props: reactive({
                    prop: 'password',
                    label: '密码',
                    required: true,
                  }),
                  key: 'password',
                  vshow: computed(() => model.username !== '1234'),
                  slots: {
                    default: useInput({
                      props: {
                        value: password,
                        placeholder: '请输入密码',
                        type: 'password',
                        onUpdateValue: (value: string) => {
                          console.log(value);
                          model.password = value;
                        },
                      },
                    }),
                  },
                }),
              ],
            },
          },
        },
      });
    },
  });
}
