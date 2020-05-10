import { Octokit } from '@octokit/rest'

export enum PullRequestState {
  Open = "open",
  Closed = "closed"
}

export class PullRequest {
  id: number
  number: number
  author: string
  draft: boolean
  headRef: string
  baseRef: string

  constructor(pullRequestItem : Octokit.PullsListResponseItem) {
    this.id = pullRequestItem.id
    this.number = pullRequestItem.number
    this.author = pullRequestItem.user.login
    this.draft = pullRequestItem.draft
    this.headRef = pullRequestItem.head.ref
    this.baseRef = pullRequestItem.base.ref
  }
}