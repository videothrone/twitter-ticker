const express = require("express");
const app = express();
const twitter = require("./twitter");
const util = require("util");
const getToken = util.promisify(twitter.getToken);
const getTweets = util.promisify(twitter.getTweets);
// const filterTweets = util.promisify(twitter..filterTweets);

app.use(express.static("./public"));

//route to get twitter headlines token & tweets via twitter.js module
//re-factored promises version
app.get("/data.json", (req, res) => {
    getToken().then(token => {
        // return getTweets(token);
        return Promise.all([
            getTweets(token, "realpunknews"),
            getTweets(token, "clickhole"),
            getTweets(token, "theonion")
        ])
            .then(tweets => {
                //created variable for filterTweets function, which is on twitter.js
                let realpunknews = tweets[0];
                let clickhole = tweets[1];
                let theonion = tweets[2];
                //concat
                // let mergedTweets = bbcworld.concat(sciam, theonion);
                //spread operator
                let mergedTweets = [...realpunknews, ...clickhole, ...theonion];
                let sorted = mergedTweets.sort((a, b) => {
                    return new Date(b.created_at) - new Date(a.created_at);
                });
                //filtering
                let filteredTweets = twitter.filterTweets(sorted);
                res.json(filteredTweets);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(500);
            });
    });
});

//non-promises version
// app.get("/data.json", (req, res) => {
//     twitter.getToken(function(err, token) {
//         if (err) {
//             console.log(err);
//             res.sendStatus(500);
//         } else {
//             twitter.getTweets(token, function(err, tweets) {
//                 if (err) {
//                     console.log(err);
//                     res.sendStatus(500);
//                 } else {
//                     //created variable for filterTweets function, which is on twitter.js
//                     let filteredTweets = twitter.filterTweets(tweets);
//                     res.json(filteredTweets);
//                     // console.log(tweets);
//                 }
//             });
//         }
//     });
// });

app.listen(8080, () => console.log(`I'm listening...`));
