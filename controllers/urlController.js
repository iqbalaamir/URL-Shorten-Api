const URL = require('../models/URL');


exports.shortenURL = async (req, res) => {
    const { originalURL } = req.body;
    const userId = req.user.id;
    try {
        const existingURL = await URL.findOne({ originalURL, userId });
        if (existingURL) return res.status(200).json(existingURL);

        const url = new URL({ originalURL, userId });

        await url.save();

        res.status(201).json(url);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};




exports.redirectToURL = async (req, res) => {
    const { shortURL } = req.params;
    try {
        const url = await URL.findOne({ shortURL });
        if (!url) return res.status(404).json({ message: 'URL not found' });
        // Increase the click count for the URL
        url.clicks++;
        await url.save();
        res.redirect(url.originalURL);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};


exports.getAllUrls = async (req, res) => {
    const userId = req.user.id;
    try {
        const urls = await URL.find({ userId });
        res.status(200).json(urls);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

