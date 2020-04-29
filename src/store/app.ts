import { observable } from "mobx";

export const App = {
  loading : observable.box(false),
  setLoading(isLoading) {
    App.loading.set(isLoading);
  },
};
