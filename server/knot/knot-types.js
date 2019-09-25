require('dotenv').config();

export const applicationSecretKey = () => process.env.SECRET_KEY;