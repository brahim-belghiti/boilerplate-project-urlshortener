const { createShortURLService, getShortURLController } = require('../services/urlService');

exports.createShortURLController = async (req, res) => {
    const originalUrl = req.body.url;
    try {
        const result = await createShortURLService(originalUrl);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getShortURLController = async (req, res) => {
    const shortUrl = req.params.shorturl;
    try {
        const originalUrl = await getShortURLController(shortUrl)
        res.redirect(301, originalUrl); // Redirect to the original URL
    }
    catch (err) {
        res.status(404).json({ error: err.message });
    }
}