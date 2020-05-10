import * as core from '@actions/core'
import * as github from '@actions/github'
import { Client } from './client'
import { Event } from './event'
import { Enforcer } from './enforcer';

async function run(): Promise<void> {
  try {
    if (github.context.eventName !== Event.PullRequest || github.context.payload.pull_request === undefined) {
      core.setFailed("This action can only be used with pull request events");
      return
    }
    const triggeringPRNumber: number = github.context.payload.pull_request!.number

    const repoToken =  core.getInput('repo-token');
    const repoLimit = Number(core.getInput('repo-limit'));
    const perAuthorLimit = Number(core.getInput('per-author-limit'));

    const {owner, repo} = github.context.repo
    const client = new Client(repoToken, owner, repo)
    const enforcer = new Enforcer(client, {repoLimit, perAuthorLimit}, triggeringPRNumber)

    await enforcer.enforceLimits();

  } catch (error) {
    core.setFailed(error.message);
  }
}
run();

export default run;