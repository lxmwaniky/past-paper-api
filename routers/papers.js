const express = require('express');
const router = express.Router();
const { Paper } = require('../models/paper');

router.post('/', async (req, res) => {
    try {
        const { unitCode, yearTaken, unitTitle, fileLocation, classOfStudy } = req.body;
        const paper = new Paper({
            unitCode,
            yearTaken,
            unitTitle,
            fileLocation,
            classOfStudy
        });
        const savedPaper = await paper.save();
        res.status(201).json(savedPaper);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const papers = await Paper.find();
        if (papers.length === 0) return res.status(404).json({ message: 'Papers NOT found' });
        res.status(200).json(papers);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.get('/:unitCode/:yearTaken', async (req, res) => {
    try {
        const { unitCode, yearTaken } = req.params;
        const paper = await Paper.findOne({ unitCode, yearTaken });
        if (!paper) return res.status(404).json({ message: 'Paper NOT found' });
        res.status(200).json(paper);
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
});

router.get('/:unitCode', async (req, res) => {
    try {
        const { unitCode } = req.params;
        const papers = await Paper.find({ unitCode });
        if (papers.length === 0) return res.status(404).json({ message: 'Papers NOT found' });
        res.status(200).json(papers);
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
});

router.put('/:unitCode/:yearTaken', async (req, res) => {
    try {
        const paper = await Paper.findOne({ unitCode: req.params.unitCode, yearTaken: req.params.yearTaken });
        if (!paper) return res.status(404).json({ message: 'Paper NOT found' });

        const { unitCode, yearTaken, unitTitle, fileLocation, classOfStudy } = req.body;

        paper.unitCode = unitCode || paper.unitCode;
        paper.yearTaken = yearTaken || paper.yearTaken;
        paper.unitTitle = unitTitle || paper.unitTitle;
        paper.fileLocation = fileLocation || paper.fileLocation;
        paper.classOfStudy = classOfStudy || paper.classOfStudy;

        const updatedPaper = await paper.save();
        res.status(200).json(updatedPaper);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.delete('/:unitCode/:yearTaken', async (req, res) => {
    try {
        const paper = await Paper.findOne({ unitCode: req.params.unitCode, yearTaken: req.params.yearTaken });
        if (!paper) return res.status(404).json({ message: 'Paper NOT found' });

        await paper.remove();
        res.status(200).json({ message: 'Paper deleted successfully' });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

module.exports = router;