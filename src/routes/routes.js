const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const ShortnedURl = require('../models/url');
const dns = require('dns');
const Counter = require('../models/counter');

// Endpoint for creating a shortened URL
router.post('/shorturl', async (req, res) => {
    // Extract the original URL from the request body
    const originalUrl = req.body.url;

    // Check if the original URL is provided
    if (!originalUrl) {
        return res.status(400).json({ error: 'Please provide a URL' });
    }

    // Increment the counter and get the updated count
    const updatedCounter = await Counter.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true });

    // Construct the short URL using the updated count
    const shortUrl = updatedCounter.count;

    // Create a new ShortenedUrl document
    const newShortenedUrl = new ShortenedUrl({
        original_url: originalUrl,
        short_url: shortUrl
    });

    try {
        // Save the new ShortenedUrl document
        await newShortenedUrl.save();
        // Respond with the original and shortened URLs
        res.status(200).json({ original_url: originalUrl, short_url: shortUrl });
    } catch (err) {
        // Handle any errors
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/shorturl/:shorturl', (req, res) => {
    const shortUrl = req.params.shorturl;
    ShortnedURl.findOne({ short_url: Number(shortUrl) })
        .then((doc) => {
            if (!doc) {
                return res.status(404).json({ message: "URL not found" });
            }
            console.log("🚀 ~ .then ~ doc:", doc)

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