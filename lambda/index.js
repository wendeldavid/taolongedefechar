/*
 * Copyright 2018-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

// sets up dependencies
const Alexa = require("ask-sdk-core");
const i18n = require("i18next");
const languageStrings = require("./languageStrings");
const sprintf = require("i18next-sprintf-postprocessor");

const hltb = require("./hltb.js");

const LaunchHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    console.log(handlerInput);

    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    return handlerInput.responseBuilder
      .speak(requestAttributes.t("HELLO_MESSAGE"))
      .reprompt(requestAttributes.t("REPROMPT"))
      .getResponse();
  },
};

const getImageAPL = function (imageUrl, width, height) {
  return {
    type: "APL",
    version: "2023.2",
    theme: "dark",
    mainTemplate: {
      parameters: ["payload"],
      items: [
        {
          type: "Container",
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          items: [
            {
              type: "Image",
              source: imageUrl,
              imageAlignment: "center",
              imageBlurredBackground: true,
              imageAspectRatio: "square",
              imageScale: "best-fit",
              height: height - 20,
              width: width - 20,
            },
          ],
        },
      ],
    },
  };
};

const GetGameTimesHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "GetGameTimesIntent"
    );
  },
  async handle(handlerInput) {
    console.log(handlerInput);

    const request = handlerInput.requestEnvelope.request;
    const intent = request.intent;

    console.log(intent.slots.game_name.slotValue);
    const gameName = intent.slots.game_name.value;

    const gameData = await hltb.listGames(gameName);
    console.log(gameData);

    const output = hltb.processResponse(gameData.data.data);
    const outputSpeak = output.text + hltb.getSuffix();

    console.log(outputSpeak);

    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const randomReprompt = requestAttributes.t("REPROMPT");
    console.log(`reprompt: ${randomReprompt}`);

    const response = handlerInput.responseBuilder;
    response.speak(outputSpeak);
    response.reprompt(randomReprompt);

    const context = handlerInput.requestEnvelope.context;

    console.log(context.System.device.supportedInterfaces);
    if (
        context.Viewport &&
        (context.System.device.supportedInterfaces["Alexa.Presentation.APL"] ||
          context["Alexa.Presentation.APL"]
      )
    ) {
      console.log("e entrou pra imprimir a capinha do fucking jogo");

      if (context["Alexa.Presentation.APL"]) {
        console.log(context["Alexa.Presentation.APL"]);
      }

      console.log(context.Viewport);
      response.addDirective({
        type: "Alexa.Presentation.APL.RenderDocument",
        version: "1.0",
        document: getImageAPL(
          output.imageUrl,
          context.Viewport.pixelWidth,
          context.Viewport.pixelHeight
        ),
        datasources: {
          templateData: {
            header: "header",
            text: output.text,
            backgroundSmall: output.imageUrl,
            backgroundLarge: output.imageUrl,
          },
        },
      });
    }
    return response.getResponse();
  },
};

const ErrorHandler = {
  canHandle(handlerInput) {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    console.log(handlerInput.requestEnvelope.request.error);
    const requestAttributes =
      handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("ERROR_MESSAGE"))
      .reprompt(requestAttributes.t("ERROR_MESSAGE"))
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const requestAttributes =
      handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("HELP_MESSAGE"))
      .reprompt(requestAttributes.t("HELP_REPROMPT"))
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    const { requestEnvelope } = handlerInput;
    const request = requestEnvelope.request;

    console.log(
      `Session ended with reason: ${request.reason}: ${request.error.type}, ${request.error.message}`
    );
    console.log(
      `Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`
    );

    return handlerInput.responseBuilder
      .withShouldEndSession(true)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      (request.intent.name === "AMAZON.CancelIntent" ||
        request.intent.name === "AMAZON.StopIntent" ||
        request.intent.name === "AMAZON.NoIntent")
    );
  },
  handle(handlerInput) {
    const requestAttributes =
      handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("STOP_MESSAGE"))
      .withShouldEndSession(true)
      .getResponse();
  },
};

const FallbackHandler = {
  // The FallbackIntent can only be sent in those locales which support it,
  // so this handler will always be skipped in locales where it is not supported.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    const requestAttributes =
      handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("FALLBACK_MESSAGE"))
      .reprompt(requestAttributes.t("FALLBACK_REPROMPT"))
      .getResponse();
  },
};

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: "en", // fallback to EN if locale doesn't exist
      resources: languageStrings,
    });

    localizationClient.localize = function () {
      const args = arguments;
      let values = [];

      for (var i = 1; i < args.length; i++) {
        values.push(args[i]);
      }
      const value = i18n.t(args[0], {
        returnObjects: true,
        postProcess: "sprintf",
        sprintf: values,
      });

      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      } else {
        return value;
      }
    };

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      // pass on arguments to the localizationClient
      return localizationClient.localize(...args);
    };
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchHandler,
    GetGameTimesHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent("skill/hltb")
  .lambda();
