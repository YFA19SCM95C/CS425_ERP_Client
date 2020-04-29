import { observable } from "mobx";
import { getLoginStatus, doLogin, doLogout } from "../api/login";

export const Login = {
  isLogin : observable.box(false),
  userInfo: observable.box({ name: '', email: '', avatar: '' }),
  setLoginStatus(isLogin) {
    Login.isLogin.set(isLogin);
  },
  async getLoginStatus() {
    const result = await getLoginStatus();
    const { status, userInfo } = result.data;
    Login.isLogin.set(status == '1');
    if (status == '1') {
      Login.userInfo.set(userInfo);
    }
    return result;
  },
  async doLogin(params: { username: string; password: string }) {
    const result = await doLogin(params);
    const data = result.data;
    if (data.ok == 1) {
      Login.isLogin.set(true);
      const { name, email, avatar } = data.userInfo;
      Login.userInfo.set({
        name,
        email,
        avatar
      });
    }
    return Promise.resolve(result);
  },
  async doLogout() {
    const result = await doLogout();
    const data = result.data;
    if (data.ok == 1) {
      Login.isLogin.set(false);
    }
    return Promise.resolve(result);
  }
};
