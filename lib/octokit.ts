import { App, Octokit } from "octokit";

let _octokit: Octokit | null = null;

async function getOctokit() {
  if (!_octokit) {
    const app = new App({
      appId: process.env.GITHUB_APP_ID!,
      privateKey: process.env.GITHUB_PRIVATE_KEY!,
    });

    const installationId = Number(process.env.GITHUB_INSTALLATION_ID);
    _octokit = await app.getInstallationOctokit(installationId);
  }
  return _octokit;
}

const octokit = await getOctokit();

export default octokit;
