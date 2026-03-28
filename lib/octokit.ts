import { Octokit } from "octokit";
import app from "./github-app";

let _octokit: Octokit | null = null;

async function getOctokit() {
  if (!_octokit) {
    const installationId = Number(process.env.GITHUB_INSTALLATION_ID);
    _octokit = await app.getInstallationOctokit(installationId);
  }
  return _octokit;
}

const octokit = await getOctokit();

export default octokit;
