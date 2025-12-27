import { computed, onMounted, reactive, ref, shallowRef, watch } from "vue";
import { defineViewlessComponent } from "../lib/use-component.tsx";
import { NForm, NFormItem, NInput } from "naive-ui";

export function UseForm() {
  return defineViewlessComponent({
    setup: (_props, context) => {
      const username = ref("123");
      const password = ref("");
      const model = reactive({
        username,
        password,
      });
      onMounted(() => {
        console.log("组件挂载完成");
        console.log(model);
        model.username = "默认用户名";
      });
      watch(
        () => model.username,
        (newValue, oldValue) => {
          console.log("用户名变化了", newValue, oldValue);
          context.emit("change", model);
        },
      );
      watch(
        () => model.password,
        (newValue, oldValue) => {
          console.log("密码变化了", newValue, oldValue);
        },
      );
      return reactive({
        component: shallowRef(NForm),
        props: reactive({
          model: model,
        }),
        slots: {
          default: [
            {
              component: shallowRef(NFormItem),
              props: reactive({
                path: "username",
                label: "用户名",
                required: true,
              }),
              key: "username",
              slots: {
                default: {
                  component: shallowRef(NInput),
                  props: {
                    value: username,
                    placeholder: "请输入用户名",
                    onUpdateValue: (value: string) => {
                      console.log(value);
                      model.username = value;
                    },
                  },
                },
              },
            },
            {
              component: shallowRef(NFormItem),
              props: reactive({
                path: "password",
                label: "密码",
                required: true,
              }),
              key: "password",
              show: computed(() => model.username !== "1234"),
              slots: {
                default: {
                  component: shallowRef(NInput),
                  props: {
                    value: password,
                    placeholder: "请输入密码",
                    type: "password",
                    onUpdateValue: (value: string) => {
                      console.log(value);
                      model.password = value;
                    },
                  },
                },
              },
            },
          ],
        },
      });
    },
  });
}
