import { reactive } from 'vue';
type NavigationState = Record<string, unknown>;

const navigationState = reactive<NavigationState>({});

export const useNavigationState = () => {
  const setState = (key: string, value: unknown): void => {
    navigationState[key] = value;
  };

  const getState = (key: string): unknown => {
    return navigationState[key];
  };

  return { setState, getState };
};
