const dns = require('dns');
const Counter = require('../models/counter');
const ShortnedURl = require('../models/url');

async function createShortURLService(originalUrl) {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

    // Validate URL
    if (!originalUrl || !urlRegex.test(originalUrl)) {
        throw new Error('Invalid URL');
    }

    // Perform DNS lookup asynchronously
    const { hostname } = new URL(originalUrl);
    return new Promise((resolve, reject) => {
        dns.lookup(hostname, async (err, address, family) => {
            if (err) {
                console.error(err);
                reject(new Error('DNS lookup failed'));
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
                resolve({ original_url: originalUrl, short_url: shortUrl });
            } catch (err) {
                console.error(err);
                reject(new Error('Internal Server Error'));
            }
        });
    });
}

async function getShortURLService(shortUrl) {
    try {
        const doc = await ShortnedURl.findOne({ short_url: Number(shortUrl) });
        if (!doc) {
            throw new Error('URL not found');
        }
        return doc.original_url;
    } catch (err) {
        console.error(err);
        throw new Error('Internal server error');
    }
}

module.exports = { createShortURLService, getShortURLService };
