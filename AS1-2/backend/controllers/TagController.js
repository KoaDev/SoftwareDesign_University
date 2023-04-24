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
        await tag.save();
        res.status(201).json({ message: 'Tag created' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
