# circle-round
Unofficial Alexa app that plays Circle Round podcasts

## flow

1. "Alexa, ask Circle Round to play the episode about oni and ricecakes"
1. search through the keyword column of the google sheet for a match
1. if there's a match, say the title and begin playing from the podcast URL
1. if there's no match, direct users back to step 1.


## development

* set up required environment variables in the AWS lambda console:
    * `API_KEY` = Google Sheet API key
    * `SHEET_ID` = Google Sheet Id (visible in the sheet URL)

* lambda related work is all in the `/lambda` directory.  To push changes,
use the `publish.sh` script which assumes you already have the AWS CLI set up with the right env variables.

* `skill.json` is the interaction model json and can be copy/pasted directly into the alexa developer console's JSON editor.
