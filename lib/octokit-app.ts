import { App } from "octokit";

let _app: App | null = null;

function getApp() {
  if (!_app) {
    _app = new App({
      appId: process.env.GITHUB_APP_ID!,
      privateKey: process.env.GITHUB_PRIVATE_KEY!,
    });
  }
  return _app;
}

export const app = getApp();
