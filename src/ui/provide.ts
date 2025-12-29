import { provide } from 'vue';
import { ADAPTOR_KEY } from '@/lib/const';
import type { UiComponent } from '@/lib/use-component';

type Adaptor = (opt: UiComponent) => UiComponent;
type AdaptorFn = () => { adaptorMap: Record<string, Adaptor>; adaptor: Adaptor };

export function useProvideAdaptor(useAdaptor: AdaptorFn) {
  const { adaptor } = useAdaptor();
  provide(ADAPTOR_KEY, adaptor);
}
