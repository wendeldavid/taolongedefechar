var axios = require("axios");

const listGames = async function(gameName) {
    console.log("request game for hltb: " + gameName);

    var data = JSON.stringify({
    searchType: "games",
    searchTerms: gameName.split(" "),
    searchPage: 1,
    size: 20,
    searchOptions: {
        games: {
        userId: 0,
        platform: "",
        sortCategory: "popular",
        rangeCategory: "main",
        rangeTime: {
            min: null,
            max: null,
        },
        gameplay: {
            perspective: "",
            flow: "",
            genre: "",
        },
        rangeYear: {
            min: "",
            max: "",
        },
        modifier: "",
        },
        users: {
        sortCategory: "postcount",
        },
        lists: {
        sortCategory: "follows",
        },
        filter: "",
        sort: 0,
        randomizer: 0,
    },
    });

    var config = {
    method: "post",
    url: "https://howlongtobeat.com/api/search",
    headers: {
        authority: "howlongtobeat.com",
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        origin: "https://howlongtobeat.com",
        referer: "https://howlongtobeat.com/",
        "sec-ch-ua": '"Not.A/Brand";v="8", "Chromium";v="114", "Brave";v="114"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    },
    data: data,
    };

    return axios(config);  
};

const processResponse = function(data) {
    if (!data || data.length <= 0) {
      return {
        text : "Não encontrei o jogo que você procura. Tente refinar citando o número do jogo junto ao título, ou optar apenas pelo sub título ao invés do número"
      };
    }
    console.log(data);

    const game = {
      id: data[0].game_id,
      name: data[0].game_name,
      main: Math.round(data[0].comp_main / 3600),
      plus: Math.round(data[0].comp_plus / 3600),
    };
    
    let text = "o jogo " + game.name + " tem aproximadamente " + game.main + " horas de jogo principal, e cerca de " + game.plus + " horas considerando todos os objetivos";
    
    return {
      text: text,
      imageUrl: "https://howlongtobeat.com/games/" + data[0].game_image
    };
}

module.exports = {
  listGames: listGames,
  processResponse: processResponse
};