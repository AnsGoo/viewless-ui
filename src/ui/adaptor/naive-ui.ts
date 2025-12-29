import type { UiComponent } from "@/lib/use-component";
import { NCard, NForm, NFormItem, NInput } from "naive-ui";
import { shallowRef } from "vue";

function useFormAdaptor(opt: UiComponent) {
  opt.component = shallowRef(NForm);
  return opt;
}

function useFormItemAdaptor(opt: UiComponent) {
  opt.component = shallowRef(NFormItem);
  return opt;
}

function useInputAdaptor(opt: UiComponent) {
  opt.component = shallowRef(NInput);
  return opt;
}

function useCardAdaptor(opt: UiComponent) {
  opt.component = shallowRef(NCard);
  return opt;
}

export function useAdaptor() {
  const adaptorMap: Record<string, (opt: UiComponent) => UiComponent> = {};
  adaptorMap["Form"] = useFormAdaptor;
  adaptorMap["FormItem"] = useFormItemAdaptor;
  adaptorMap["Input"] = useInputAdaptor;
  adaptorMap["Card"] = useCardAdaptor;
  const adaptor = (opt: UiComponent) => {
    if (typeof opt.component !== "string") {
      return opt;
    }
    const adaptor = adaptorMap[opt.component];
    if (adaptor) {
      return adaptor(opt);
    }
    return opt;
  };

  return {
    adaptorMap,
    adaptor,
  };
}
