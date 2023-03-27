const Tags = require('../models/tag');

exports.getTags = async (req, res, next) => {
    try {
        const tags = await Tags.find();
        res.json(tags);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

exports.createTag = async (req, res, next) => {
    try {
        const tag = new Tags({
            name: req.body.name
        });
        const savedTag = await tag.save();
        res.status(201).json(savedTag);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
