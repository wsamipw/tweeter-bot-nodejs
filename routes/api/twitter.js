const express = require("express");
const router = express.Router();
const Twit = require("twit");
const CONSTANTS = require("../../config/CONSTANTS");
const models = require("../../models/index");

//initialize Twitter
var T = new Twit({
  consumer_key: CONSTANTS.API_KEY,
  consumer_secret: CONSTANTS.SECRET_KEY,
  access_token: CONSTANTS.ACCESS_TOKEN,
  access_token_secret: CONSTANTS.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000 // optional HTTP request timeout to apply to all requests.
  // strictSSL: true // optional - requires SSL certificates to be valid.
});

router.post("/status", (req, res) => {
  var status = req.body.status;
  T.post(
    "statuses/update",
    {
      status
    },
    function(err, data, response) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    }
  );
});
router.post("/search", (req, res) => {
  var term = req.body.term;
  var count = req.body.count;
  console.log("search body::", req.body.term);
  T.get(
    "search/tweets",
    {
      q: term,
      count: count || 20
    },
    function(err, data, response) {
      if (err) {
        return res.json(err);
      } else {
        return res.json(data);
      }
    }
  );
});

router.get("/location", (req, res) => {
  T.get("trends/available", {}, function(err, data, response) {
    return res.json(data);
  });
});
router.get("/trending", (req, res) => {
  var { id } = req.query;
  console.log("req query::", id);
  T.get(
    "trends/place",
    {
      id
    },
    function(err, data, response) {
      if (err) {
        res.json(err);
      } else {
        res.json(data);
      }
    }
  );
});

router.post("/campaign", (req, res) => {
  const newCampaign = {
    name: req.body.name,
    trendingLocation: req.body.trendingLocation || "1",
    customSearchTerm: req.body.trendingLocation || null,
    frequency: req.body.frequency || 10,
    includeTargetHandle: req.body.includeTargetHandle,
    includeTargetHashtag: req.body.includeTargetHashtag,
    customHashtags: req.body.customHashtags,
    tweets: req.body.tweets,
    mad: false
  };
  if (!newCampaign.name) {
    return res.status(400).json({
      msg: "Campaign name is required."
    });
  } else {
    models.Campaign.create(newCampaign)
      .then(() => {
        console.log("new campaign created");
        return res.status(200).json({
          data: newCampaign,
          msg: "Camaign created successfully."
        });
      })
      .catch(e => {
        console.log("Error creating campaign:", e);
        return res.status(400).json({
          msg: "Failed to create new campaign."
        });
      });
    console.log("campaign body::", req.body);
  }
});

router.post("/campaign/start", (req, res) => {
  console.log("campaign body::", req.body);
});

router.get("/campaign", (req, res) => {
  models.Campaign.findAll().then(campaigns => {
    res.status(200).json({
      campaigns: campaigns
    });
  });
});
router.get("/campaign/:id", (req, res) => {
  models.Campaign.findByPk(parseInt(req.params.id))
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        res.status(400).json({
          msg: "Campaign Not found"
        });
      }
    })
    .catch(e => {
      res.status(400).json({
        error: e
      });
    });
});


router.put("/campaign/:id", (req, res) => {
  // let users = [];
  models.Campaign.findByPk(parseInt(req.params.id))
    .then(result => {
      models.Campaign.update(
        {
          mad: req.body.mad
        },
        {
          returning: true,
          where: {
            id: parseInt(req.params.id)
          },
          fields: ["mad"]
        }
      ).then(([rowsUpdate, [updatedCampaign]]) => {
        let campaign = updatedCampaign.dataValues;
        console.log("campaign", campaign);
        if (campaign.mad) {
          let tweets = [];
          // let toBeTwitted = [];
          campaign.tweets.forEach(tweet => tweets.push(JSON.parse(tweet)));
          console.log("tweets:", tweets);
          let interval = (1 / campaign.frequency) * 60 * 1000;
          let totalRun = 0;
          let letsGetMad = setInterval(() => {
            if (CONSTANTS.ACTIVE_USERS.length == totalRun) {
              console.log("FINISHED");
              clearInterval(letsGetMad);
            } else {
              totalRun++;
              for (user of CONSTANTS.ACTIVE_USERS) {
                console.log("getting users...");
                T.get("search/tweets", {
                  q: user,
                  count: 100
                })
                  .then(response => {
                    console.log("response from search:", response.data.statuses.length);
                    response.data.statuses.forEach(status => {
                      // console.log("STATUS::", status);
                      // users.push(status.user.screen_name);
                      tweets.forEach(tweet => {
                        if (campaign.mad) {
                          let t = `${tweet.tweet} @${status.user.screen_name}`;
                          console.log("twittting", t);
                          var status = req.body.status;
                          // T.post(
                          //   "statuses/update",
                          //   {
                          //     status: t
                          //   },
                          //   function(err, data, response) {
                          //     if (err) {
                          //       console.log(
                          //         "error twitting: @",
                          //         status.user.screen_name
                          //       );
                          //       // return res.json(err);
                          //     } else {
                          //       console.log("DONE");
                          //       // return res.json(data);
                          //     }
                          //   }
                          // );
                        } else {
                          console.log("Campaign Stopped by user");
                          clearInterval(letsGetMad);
                        }
                      });
                    });
                  })
                  .catch(error => {
                    console.log("ERROR::::::", error);
                  });
              }
            }
          }, interval);
        } else {
          console.log("CAMPAIGN STOPPED");
        }

        // let uniq_users = [...new Set(users)];
        // console.log("unique users length::", uniq_users.length);
      });
      return res.status(200).json({
        status: 200,
        msg: "success"
      });
    })
    .catch(e => {
      console.log("err:", e);
      res.status(400).json({
        msg: "Requested Campaign not found.",
        error: e
      });
    });
});

module.exports = router;
