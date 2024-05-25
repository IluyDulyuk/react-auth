const UserModal = require('../models/user-modal');
const bcrypt = require('bcrypt');
const uuid = require('uuid')
const MailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');

class UserService {
    async registration(email, password) {
        const candidate = await UserModal.findOne({email});

        if(candidate) {
            throw new Error('Пользователь с таким Email уже зарегестрирован');
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        const user = await UserModal.create({email, hashPassword, activationLink});

        await MailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink) {
        const user = await UserModal.findOne({activationLink});

        if(!user) {
            throw new Error('Неккоректная ссылка для активации');
        }

        user.isActivated = true;
        user.save();
    }
}

module.exports = new UserService();
