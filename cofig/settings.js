require('dotenv').config();

const SETTINGS = {
    PORT : process.env.PORT || 3000,
    STAFFING_THRESHOLD: process.env.STAFFING_THRESHOLD || 5
};

module.exports = SETTINGS;
