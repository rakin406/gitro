import { App } from "octokit";

let _app: App | null = null;

function getApp() {
  if (!_app) {
    _app = new App({ appId, privateKey });
  }
  return _app;
}

export const app = getApp();
