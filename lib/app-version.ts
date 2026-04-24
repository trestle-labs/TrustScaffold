import { execSync } from 'node:child_process';

import packageJson from '@/package.json';

export const APP_VERSION = packageJson.version;
export const APP_VERSION_LABEL = `v${APP_VERSION}`;

function resolveGitCommit() {
	const envCommit = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || process.env.COMMIT_SHA;

	if (envCommit) {
		return envCommit.slice(0, 7);
	}

	try {
		return execSync('git rev-parse --short HEAD', {
			cwd: process.cwd(),
			stdio: ['ignore', 'pipe', 'ignore'],
		})
			.toString()
			.trim();
	} catch {
		return 'unknown';
	}
}

export const APP_GIT_COMMIT = resolveGitCommit();