import * as github from '@actions/github'
import { PullRequest, PullRequestState } from './pullRequest'


export class Client {
  // TOOD: make me private
  public client: github.GitHub
  private repoOwner: string
  private repoName: string

  constructor(repoToken: string, repoOwner: string, repoName: string ) {
    this.client = new github.GitHub(repoToken)
    this.repoOwner = repoOwner
    this.repoName = repoName
  }

  async getOpenPullRequests() {
    let pullRequests : Array<PullRequest> = new Array<PullRequest>();

    const reviewrequest = this.client.pulls.list({
      owner: this.repoOwner,
      repo: this.repoName,
      state: PullRequestState.Open
    });

    const result = await reviewrequest
    const openPullRequests = result.data

    for (let prItem of openPullRequests) {
      const pr = new PullRequest(prItem)
      pullRequests.push(pr)
    }

    return pullRequests
  }
}
