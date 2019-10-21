const https = require("https");
const { consumerKey, consumerSecret } = require("./secrets");

//http(s) & auth requests to get twitter token & tweets
exports.getToken = callback => {
    const req = https.request(
        {
            method: "POST",
            host: "api.twitter.com",
            path: "/oauth2/token",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
                Authorization: `Basic ${Buffer.from(
                    `${consumerKey}:${consumerSecret}`
                ).toString("base64")}`
            }
        },
        resp => {
            if (resp.statusCode != 200) {
                callback(resp.statusCode);
            } else {
                let body = "";
                resp.on("data", chunk => {
                    body += chunk;
                })
                    .on("end", () => {
                        try {
                            callback(null, JSON.parse(body).access_token);
                        } catch (err) {
                            callback(err);
                        }
                    })
                    .on("error", err => callback(err));
            }
        }
    );
    req.on("error", err => callback(err));
    req.end(`grant_type=client_credentials`);
};

//get array of objects, put into body
exports.getTweets = (token, name, callback) => {
    const authorization = "Bearer " + token;
    // console.log("name:", name);
    const req = https.request(
        {
            method: "GET",
            host: "api.twitter.com",
            path: `/1.1/statuses/user_timeline.json?screen_name=${name}&tweet_mode=extended`,
            headers: {
                Authorization: authorization
            }
        },
        resp => {
            if (resp.statusCode != 200) {
                callback(resp.statusCode);
            } else {
                let body = "";
                resp.on("data", chunk => {
                    body += chunk;
                })
                    .on("end", () => {
                        try {
                            // let parsedBody = JSON.parse(body);
                            // console.log(parsedBody);
                            // console.log(parsedBody[i].entities.urls);
                            callback(null, JSON.parse(body));
                        } catch (err) {
                            callback(err);
                        }
                    })
                    .on("error", err => callback(err));
            }
        }
    );
    req.on("error", err => callback(err));
    req.end();
};

//created function that handles filtering logic and can be accessed in index.js
exports.filterTweets = tweets => {
    let filteredTweets = [];
    tweets.map(function(tweet) {
        if (tweet.entities.urls.length === 1) {
            // for (let i = 0; i < tweet[i].entities.media.length; i++) {
            //     replace(tweet[i].entities.media[i].url, "");
            // }
            // console.log(tweet.entities);
            filteredTweets.push({
                text:
                    tweet.full_text.slice(0, tweet.full_text.indexOf("http")) +
                    `(${tweet.user.name})`,
                url: tweet.entities.urls[0].url
            });
        }
    });
    filteredTweets.filter(tweet => tweet != null);
    return filteredTweets;
};
