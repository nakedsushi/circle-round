'use strict';

const Alexa = require('ask-sdk');

// TODO fill out
const APP_ID = '';

const languageStrings = {
  'en': {
    translation: {
      SKILL_NAME: 'Circle Round',
      WELCOME_MESSAGE: "Welcome to Circle Round.  You can ask me to play an episode by saying...play an episode about X and Z.",
      WELCOME_REPROMPT: 'Are you ready? Ask me to play an episode by saying...play an episode about X',
      DISPLAY_CARD_TITLE: '%s  - Play Circle Round episodes',
      HELP_MESSAGE: "Ask me to play an episode by saying...play an episode about dragons",
      HELP_REPROMPT: "Ask me to play an episode by saying...play an episode about rice cakes"
    },
  }
};

const handlers = {
  'LaunchRequest': function () {
    this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
    this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');

    this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
    this.emit(':responseReady');
  },
  'PlayEpisodeIntent': function () {
    var title = "The Queen's gift";
    var url = "https://dts.podtrac.com/redirect.mp3/traffic.megaphone.fm/BUR1642881468.mp3";
    this.response
      .speak(':tell', `Playing ${title}`)
      .audioPlayerPlay(
        'REPLACE_ALL',
        url,
        null,
        0
      );
    this.emit(':responseReady');
  },
  'AMAZON.HelpIntent': function () {
    this.attributes.speechOutput = this.t('HELP_MESSAGE');
    this.attributes.repromptSpeech = this.t('HELP_REPROMPT');

    this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function () {
    this.emit('SessionEndedRequest');
  },
  'AMAZON.CancelIntent': function () {
    this.emit('SessionEndedRequest');
  },
  'SessionEndedRequest': function () {
    this.response.speak("Goodbye!");
    this.emit(':responseReady');
    console.log(`Session ended: ${this.event.request.reason}`);
  },
  'Unhandled': function () {
    this.attributes.speechOutput = this.t('HELP_MESSAGE');
    this.attributes.repromptSpeech = this.t('HELP_REPROMPT');
    this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
    this.emit(':responseReady');
  }
};

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context, callback);
  alexa.APP_ID = APP_ID;
  // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  alexa.execute();
};