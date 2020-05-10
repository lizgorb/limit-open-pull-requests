import * as core from '@actions/core'
import * as github from '@actions/github'
import { Client } from './client'
import { Event } from './event'

async function run() {
  try {
    if (github.context.eventName !== Event.PullRequest) {
      core.setFailed("This action can only be used with pull request events");
      return
    }

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);

    const nameToGreet = "you??"
    const maxPRs =  core.getInput('max');
    const repoToken =  core.getInput('repo-token');

    console.log(`Hello ${nameToGreet}`);
    console.log(`You'd like a ${maxPRs} limit!`);

    const {owner, repo} = github.context.repo
    const client = new Client(repoToken, owner, repo)

    const openPrs = await client.getOpenPullRequests()
    console.log(openPrs)


    core.setOutput("message", "lets see if this can happen");
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();

export default run;