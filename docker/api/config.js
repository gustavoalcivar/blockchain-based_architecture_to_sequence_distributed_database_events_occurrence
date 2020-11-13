module.exports = {
    JWT_SECRET: "Very super ultra secret",
    MONGO_URL: `mongodb://${process.env.DATABASE_URL || '127.0.0.1'}:27017/sawtooth-explorer`,
    SAWTOOTH_PROXY_PATH: '/sawtooth',
    blockchain: {
        REST_API_URL: process.env.REST_API_URL || 'http://rest-api-0:8008',
        VALIDATOR_URL: process.env.VALIDATOR_URL || 'tcp://validator-0:4004',
        STATE_PATH: '/state', 
        BLOCKS_PATH: '/blocks'
    },
}