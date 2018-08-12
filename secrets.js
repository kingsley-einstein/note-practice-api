require('dotenv').config();

module.exports = {
    token: process.env.TOKEN,
    user: process.env.USER,
    pass: process.env.PASS,
    secret: process.env.SECRET,
    local: process.env.LOCALDB,
    cloud: process.env.CLOUDDB
}