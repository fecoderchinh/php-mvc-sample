export default () => ({
    database: {
        uri: process.env.MONGODB_URI
    },
    jwt_secret_key: process.env.JWT_SECRET_KEY,
    jwt_ttl: process.env.JWT_TTL || '1d',
});