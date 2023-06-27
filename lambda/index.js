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
/* personalization Utility */
const personalizationUtil = require("./personalizationUtil");
const personalizationStorageUtil = require("./personalizationStorageUtil");

const hltb = require("./hltb.js");

const GetGameTimesHandler = {
  canHandle(handlerInput) {
    return true;
  },
  async handle(handlerInput) {
    console.log(handlerInput);

    const gameData = await hltb.listGames("Halo");

    const outputSpeak = hltb.processResponse(gameData.data.data);

    console.log(outputSpeak);

    return handlerInput.responseBuilder.speak(outputSpeak).getResponse();
  },
};

const ErrorHandler = {
  canHandle(handlerInput) {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes =
      handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("ERROR_MESSAGE"))
      .reprompt(requestAttributes.t("ERROR_MESSAGE"))
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    // GetNewFactHandler,
    GetGameTimesHandler
    // HelpHandler,
    // ExitHandler,
    // FallbackHandler,
    // SessionEndedRequestHandler,
    // SetPersonalizedFactPreferencesHandler
  )
  // .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  //define personalized persistence adapter for preference storage.
  // .withPersistenceAdapter(personalizationStorageUtil.personlizedPersitenceAdapter())
  // .withCustomUserAgent('sample/basic-fact/v2')
  .lambda();
