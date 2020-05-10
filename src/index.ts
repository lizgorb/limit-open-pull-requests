import * as core from '@actions/core'
import * as github from '@actions/github'

try {
  const nameToGreet = "you?" //core.getInput('who-to-greet');
  const maxPRs =  core.getInput('max');
  console.log(`Hello ${nameToGreet}!`);
  console.log(`You'd like a ${maxPRs} limit!`);
  core.setOutput("message", "lets see if this can happen");
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}