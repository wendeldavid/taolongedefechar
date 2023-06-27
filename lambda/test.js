const hltb = require("./hltb.js");

// const fs = require("fs");
// fs.readFile("./lambda/mock.json", "utf-8", (err, file) => {
//   const text = hltb.processResponse(JSON.parse(file).data);
//   console.log(text);
// });
const test = async function() {
  const req = await hltb.listGames("Halo");
  req.then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
}

test();