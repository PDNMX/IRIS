const MongoClient = require('mongodb').MongoClient,
    url = process.env.MONGO_URL;

const connectToKnot = async () => {
    try {
        const client = await MongoClient.connect(url, {useNewUrlParser: true});
        return client.db(process.env.MONGO_DB_NAME);
    } catch (e) {
        return null;
    }
};

export default connectToKnot;

