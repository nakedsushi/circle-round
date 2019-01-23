const Alexa = require('ask-sdk');
const request = require('request-promise');
const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SHEET_ID}/values/sheet1?key=${process.env.API_KEY}`;

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to Circle Round. You can ask me to play an episode by asking...Play the episode about a queen.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

function findEpisode(fields, keyword) {
  const index = fields.findIndex(function(row) {
    return row[0].split(',').includes(keyword);
  });
  if (index >= 0) {
    const title = fields[index][1];
    const url = fields[index][2];
    return [title, url];
  } else {
    return [undefined,undefined];
  }
}

const PlayEpisodeHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'PlayEpisodeRequest');
  },
  async handle(handlerInput) {
    const { requestEnvelope, attributesManager, responseBuilder } = handlerInput;
    const keyword = requestEnvelope.request.intent.slots.subject.value;
    const resp = await request(sheetsUrl);
    const fields = JSON.parse(resp).values;
    const [title, url] = findEpisode(fields, keyword);
    if (title) {
      return handlerInput.responseBuilder
        .speak(`Playing ${title}`)
        .withShouldEndSession(true)
        .addAudioPlayerPlayDirective('REPLACE_ALL', url, 'token', 0, null)
        .getResponse();
    } else {
      return handlerInput.responseBuilder
        .speak(`Sorry friend, I couldn't find the one about ${keyword}. Ask me to play another one.`)
        .withShouldEndSession(false)
        .getResponse();
    }
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
      || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    PlayEpisodeHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();