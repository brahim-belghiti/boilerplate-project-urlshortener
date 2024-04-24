const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const ShortnedURl = require('../models/url');
const dns = require('dns');
const Counter = require('../models/counter');

router.post('/shorturl', async (req, res) => {
    const originalUrl = req.body.url;
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

    // Validate URL
    if (!originalUrl || !urlRegex.test(originalUrl)) {
        return res.json({ error: 'Invalid URL' });
    }

    // Perform DNS lookup asynchronously
    const { hostname } = new URL(originalUrl);
    dns.lookup(hostname, async (err, address, family) => {
        if (err) {
            console.error(err);
            // DNS lookup failed, return an error
            return res.json({ error: 'DNS lookup failed' });
        }

        // Increment counter and generate short URL
        const updatedCounter = await Counter.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true });
        const shortUrl = updatedCounter.count;

        // Save to database
        const newShortenedUrl = new ShortnedURl({
            original_url: originalUrl,
            short_url: shortUrl
        });

        try {
            await newShortenedUrl.save();
            res.status(200).json({ original_url: originalUrl, short_url: shortUrl });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
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
            res.redirect(301, original_url); // Redirect to the original URL
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        });
});


module.exports = router;