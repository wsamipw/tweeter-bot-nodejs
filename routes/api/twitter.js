const express = require("express");
const router = express.Router();
const Twit = require("twit");
const CONSTANTS = require("../../config/CONSTANTS");

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
	T.post("statuses/update", {
		status
	}, function (
		err,
		data,
		response
	) {
		if (err) {
			return res.json(err)
		} else {
			return res.json(data)
		}
	});
});
router.post("/search", (req, res) => {
	var term = req.body.term;
	var count = req.body.count;
	console.log("search body::", req.body.term);
	T.get("search/tweets", {
		q: term,
		count: count || 20
	}, function (
		err,
		data,
		response
	) {
		if (err) {
			return res.json(err);
		} else {
			return res.json(data);
		}
	});
});

router.get("/location", (req, res) => {
	T.get("trends/available", {}, function (err, data, response) {
		return res.json(data);
	});
});
router.get("/trending", (req, res) => {
	var {
		id
	} = req.query;
	console.log("req query::", id);
	T.get("trends/place", {
		id
	}, function (err, data, response) {
		if (err) {
			res.json(err);
		} else {
			res.json(data);
		}
	});
});

router.post("/campaign", (req, res) => {
	console.log("search body::", req.body);
});

module.exports = router;