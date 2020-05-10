import { PullRequest } from './pullRequest'
import { Client } from './client'
import * as core from '@actions/core'

export interface Limits {
  repoLimit: number,
  perAuthorLimit: number
}

export class Enforcer {
  private readonly client: Client
  private readonly limits: Limits
  private readonly triggeringPrNumber: number

  constructor(client: Client, limits: Limits, triggeringPrNumber: number) {
    this.client = client
    this.limits = limits
    this.triggeringPrNumber = triggeringPrNumber
  }

  async enforceLimits(): Promise<void>{
    const openPRs = await this.client.getOpenPullRequests()
    core.debug(JSON.stringify(openPRs))

    core.info(`Using the following limits: at most ${this.limits.repoLimit} open PRs, at most ${this.limits.perAuthorLimit} open PRs per author`)

    const triggeringPR: PullRequest | undefined = openPRs.find(pr => pr.number === this.triggeringPrNumber)

    if (triggeringPR) {
      const openPRsForAuthor = openPRs.filter(pr => pr.author === triggeringPR.author)

      core.debug(`Current open PRs in the repos is ${openPRs.length}`);
      core.debug(`Current open PRs for ${triggeringPR.author} is ${openPRsForAuthor.length}`);

      if (openPRs.length > this.limits.repoLimit || openPRsForAuthor.length > this.limits.perAuthorLimit){
        await this.client.closePullRequest(triggeringPR, "Sorry, this pull request will be closed. The limit for open pull requests was exceeded.")
      }
    } else {
      core.info("The triggering PR is closed, no action will be taken.");
    }
  }
}
