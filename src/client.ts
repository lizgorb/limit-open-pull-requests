import * as github from '@actions/github'
import { PullRequest, PullRequestState } from './pullRequest'


export class Client {
  private readonly client: github.GitHub
  private readonly repoOwner: string
  private readonly repoName: string
  private openPRs: Array<PullRequest>

  constructor(repoToken: string, repoOwner: string, repoName: string ) {
    this.client = new github.GitHub(repoToken)
    this.repoOwner = repoOwner
    this.repoName = repoName
    this.openPRs = new Array<PullRequest>();
  }

  async getOpenPullRequests(): Promise<Array<PullRequest>>{
    const reviewrequest = this.client.pulls.list({
      owner: this.repoOwner,
      repo: this.repoName,
      state: PullRequestState.Open
    });

    const result = await reviewrequest
    const openPullRequests = result.data

    for (let prItem of openPullRequests) {
      const pr = new PullRequest(prItem)
      this.openPRs.push(pr)
    }

    return this.openPRs
  }

  async closePullRequest(pullrequest: PullRequest): Promise<void>{
    await this.client.pulls.update({
      pull_number: pullrequest.number,
      owner: this.repoOwner,
      repo: this.repoName,
      state: PullRequestState.Closed
    });
  }
}
