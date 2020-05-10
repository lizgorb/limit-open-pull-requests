import * as core from '@actions/core'
import * as github from '@actions/github'
import { Client } from './client'
import { Event } from './event'
import { PullRequest } from './pullRequest';

async function run(): Promise<void> {
  try {
    if (github.context.eventName !== Event.PullRequest && github.context.payload.pull_request) {
      core.setFailed("This action can only be used with pull request events");
      return
    }

    const repoToken =  core.getInput('repo-token');
    const {owner, repo} = github.context.repo
    const client = new Client(repoToken, owner, repo)

    const openPRs = await client.getOpenPullRequests()
    core.info(JSON.stringify(openPRs))

    const repoLimit = Number(core.getInput('repo-limit'));
    const perAuthorLimit = Number(core.getInput('per-author-limit'));
    core.info(`Using the following limits: at most ${repoLimit} open PRs, at most ${perAuthorLimit} open PRs per author.`)

    const pullRequestNumber: number = github.context.payload.pull_request!.number
    const triggeringPR: PullRequest | undefined = openPRs.find(pr => pr.number === pullRequestNumber)

    if (triggeringPR) {
      const openPRsForAuthor = openPRs.filter(pr => pr.author === triggeringPR.author)

      core.info(`Current open PRs in the repos is ${openPRs.length}`);
      core.info(`Current open PRs for ${triggeringPR.author} is ${openPRsForAuthor.length}`);

      if (openPRs.length > repoLimit || openPRsForAuthor.length > perAuthorLimit){
        client.closePullRequest(triggeringPR)
      }
    } else {
      core.info("This action was triggered by a closed pull request. No action will be taken.");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();

export default run;