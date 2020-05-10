const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = "you" //core.getInput('who-to-greet');
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