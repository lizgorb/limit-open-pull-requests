import { Octokit } from '@octokit/rest'

export enum PullRequestState {
  Open = "open",
}

export class PullRequest {
  id: number
  author: string
  draft: boolean
  headRef: string
  baseRef: string

  constructor(pullRequestItem : Octokit.PullsListResponseItem) {
    this.id = pullRequestItem.id
    this.author = pullRequestItem.user.login
    this.draft = pullRequestItem.draft
    this.headRef = pullRequestItem.head.ref
    this.baseRef = pullRequestItem.base.ref
  }
}