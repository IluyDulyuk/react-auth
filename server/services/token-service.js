const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})

        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(id, token) {
        const tokenData = await tokenModel.findOne({user: id});

        if(tokenData) {
            tokenData.refreshToken = token;
            return tokenData.save()
        }

        const savedToken = tokenModel.create({user: id, token})

        return savedToken;
    }
}

module.exports = new TokenService();
