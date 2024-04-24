const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const ShortnedURl = require('../models/url');
const dns = require('dns'); 

router.post('/shorturl/:url', (req, res) => {
    const originalUrl = req.params.url;

    const newShortnedUrl = new ShortnedURl({
        original_url: originalUrl,
        short_url: Math.floor(Math.random() * 1000000)
    })

    newShortnedUrl.save()
        .then((doc) => {
            const { original_url, short_url } = doc;
            res.status(200).json({ original_url, short_url });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

router.get('/shorturl/:shorturl', (req, res) => {
    const shortUrl = req.params.shorturl;

    ShortnedURl.findOne({ short_url: Number(shortUrl) })
        .then((doc) => {
            if (!doc) {
                return res.status(404).json({ message: "URL not found" });
            }
            const { original_url } = doc;
            console.log("Redirecting to:", original_url);
            res.redirect(302, `https://${original_url}`); // Redirect to the original URL
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        });
});


module.exports = router;