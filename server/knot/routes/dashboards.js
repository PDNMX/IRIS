import express from 'express';
import {MongoClient, ObjectID} from 'mongodb';

const router = express.Router(),
    url = process.env.MONGO_URL;

let knot;

MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
    if (err) throw err;
    knot = client.db(process.env.MONGO_DB_NAME);
});

router.get('/:dashboardId', async (req, res) => {
    const {dashboardId} = req.params;

    if (!!knot) {
        const id = new ObjectID(dashboardId);
        const dashboard = await knot.collection('__dashboards').findOne({_id: id});
        res.json(dashboard);
    } else {
        res.status(500).send('knot database not found!');
    }
});


module.exports = router;