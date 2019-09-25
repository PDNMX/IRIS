import express from 'express';
import {MongoClient, ObjectID} from 'mongodb';
require('dotenv').config();


const router = express.Router(),
    url = process.env.MONGO_URL;

let knot;

MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
    if (err) throw err;
    knot = client.db(process.env.MONGO_DB_NAME);
});

router.post('/schemas', async (req, res) => {
    const schema = req.body;

    if (!!knot) {
        await knot.collection('__schemas').insertOne(schema);
        res.json(schema);
    } else {
        res.status(500).send('knot database not found!');
    }
});

router.post('/schemas/:schemaId', async (req, res) => {
    const {schemaId} = req.params;

    if (!!knot) {
        const id = new ObjectID(schemaId);
        const schema = await knot.collection('__schemas').findOne({_id: id});
        res.json(schema);
    } else {
        res.status(500).send('knot database not found!');
    }
});

router.post('/:dataSetId', async (req, res) => {
    const {dataSetId} = req.params,
        selector = req.body;

    if (!!knot) {
        try {
            const { where, limit, skip, sort } = selector,
                response = !!limit?
                    (
                        !!skip?
                            (
                                !!sort?
                                    await knot.collection(dataSetId).find(where).sort(sort).skip(skip).limit(limit).toArray():
                                    await knot.collection(dataSetId).find(where).skip(skip).limit(limit).toArray()
                            ):
                            (
                                !!sort?
                                    await knot.collection(dataSetId).find(where).sort(sort).limit(limit).toArray():
                                    await knot.collection(dataSetId).find(where).limit(limit).toArray()
                            )
                    ):
                    (
                        !!sort?
                            await knot.collection(dataSetId).find(where).sort(sort).toArray():
                            await knot.collection(dataSetId).find(where).toArray()
                    );

            res.json(response);
        }
        catch (e) {
            console.log(e);
            res.status(500).send(`Error working with mongo!`);
        }
    }
    else {
        res.status(500).send('knot database not found!');
    }
});

router.post('/:dataSetId/aggregate', async (req, res) => {
    const { dataSetId } = req.params,
        aggregation = req.body;

    if (!!knot) {
        try {
            const response = await knot.collection(dataSetId).aggregate(aggregation).toArray();
            res.json(response);
        }
        catch (e) {
            console.log(e);
            res.status(500).send(`Error aggregating ${dataSetId}!`);
        }
    }
    else {
        res.status(500).send('knot database not found!');
    }
});

router.post('/:dataSetId/count', async (req, res) => {
    const { dataSetId } = req.params,
        selector = req.body;

    if (!!knot) {

        const {where, limit, skip} = selector,
                response = !!limit ?
                    (
                        !!skip ?
                            await knot.collection(dataSetId).find(where).skip(skip).limit(limit).count() :
                            await knot.collection(dataSetId).find(where).limit(limit).count()
                    ) :
                    await knot.collection(dataSetId).find(where).count();
            res.json(response);
        } else {

        res.status(500).send('knot database not found!');
    }
});

module.exports = router;