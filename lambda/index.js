'use strict';

const Alexa = require('alexa-sdk');
const request = require('request');
const striptags = require('striptags');

# TODO fill out
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
  },
  'en-US': {
    translation: {
      SKILL_NAME: 'Circle Round',
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
    this.attributes.eventCounter = 0;
    this.attributes.dayOfWeek = undefined;
    if (!this.attributes.events) {
      getEventFromApi.call(this).then(() => {
        speakEvent.call(this); });
    } else {
      speakEvent.call(this);
    }
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