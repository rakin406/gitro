import { App, Octokit } from "octokit";

let _octokit: Octokit | null = null;

export async function getOctokit() {
  if (!_octokit) {
    // Validate environment variables
    const appId = process.env.GITHUB_APP_ID;
    const privateKey = process.env.GITHUB_PRIVATE_KEY;
    const installationIdStr = process.env.GITHUB_INSTALLATION_ID;

    if (!appId) {
      throw new Error("GITHUB_APP_ID environment variable is not set");
    }

    if (!privateKey) {
      throw new Error("GITHUB_PRIVATE_KEY environment variable is not set");
    }

    if (!installationIdStr) {
      throw new Error("GITHUB_INSTALLATION_ID environment variable is not set");
    }

    const installationId = Number(installationIdStr);
    if (isNaN(installationId) || installationId <= 0) {
      throw new Error(`Invalid GITHUB_INSTALLATION_ID: ${installationIdStr}`);
    }

    // Create app and get installation octokit
    const app = new App({
      appId,
      privateKey,
    });

    _octokit = await app.getInstallationOctokit(installationId);
  }

  return _octokit;
}
