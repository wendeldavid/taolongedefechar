/* *
 * We create a language strings object containing all of our strings.
 * The keys for each string will then be referenced in our code, e.g. handlerInput.t('WELCOME_MSG').
 * The localisation interceptor in index.js will automatically choose the strings
 * that match the request's locale.
 * */

module.exports = {
  en: {
    translation: {},
  },
  pt: {
    translation: {
      SKILL_NAME: "Tão longe de fechar",
      HELLO_MESSAGE: [
        "Olá, diga o nome do jogo que vocẽ quer saber e eu direi o tempo total para terminá-lo",
      ],
      HELP_MESSAGE:
        "Você pode me perguntar pelo tempo que um jogo leva para ser terminado. Como posso ajudar?",
      HELP_REPROMPT: "O que vai ser?",
      FALLBACK_MESSAGE:
        "Nâo sei se entendi o que você quer. diga o nome de um jogo que vou procurar",
      FALLBACK_REPROMPT: [
        "Eu posso contar o tempo que um jogo leva para ser terminado, deseja saber de qual jogo?",
        "Diga o nome de outro jogo",
      ],
      ERROR_MESSAGE: "Desculpa, algo deu errado.",
      STOP_MESSAGE: [
        "Tchau!",
        "Até o próximo jogo",
        "Espero você novamente",
        "Ok, quando precisar é só chamar",
        // "Game over",
        "Acabaram suas fichas mesmo",
        "Até a próxima controle 2",
        "Perdeu? Passa o controle",
      ],
      REPROMPT: [
        "Deseja saber de outro jogo? É só dizer o nome que eu procuro para você",
        "Diga o nome de outro jogo",
        "Próximo jogo? Diz o nome aí pra mim",
        "Por favor, diga o nome de outro para eu procurar pra você",
        "Deseja saber de qual jogo?",
      ],
    },
  },
};
