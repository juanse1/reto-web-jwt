const { mongoUtils, dataBase } = require('../lib/utils/mongo.js');
const COLLECTION_NAME = 'user';
const bycrypt = require('bcrypt');
const auth = require('../lib/utils/auth');
const saltRounds = 10;
const User = require('../roles/user');

async function login(user) {
    return mongoUtils.conn().then(async (client) => {
        const requestedUser = await client
            .db(dataBase)
            .collection(COLLECTION_NAME)
            .findOne({username: user.username})
            .finally(() => client.close());

        const isValid = await bycrypt.compare(user.password, requestedUser.password);
        let currentUser = {...requestedUser};
        if(isValid){
            delete currentUser.password;
            let token = auth.createToken(currentUser);
            currentUser.token = token;
            return currentUser;
        } else {
            throw new Error('Fallo la autenticacion');
        }
    });
}

async function createUser(user) {
    const { username, email, password, role } = user;
    newUserModel = new User({ username, email, password, role: role || "guest" });

    if(newUserModel.password){
        newUserModel.password = await bycrypt.hash(user.password, saltRounds);
    }

    return mongoUtils.conn().then( async (client) => {
        const newUser = await client
            .db(dataBase)
            .collection(COLLECTION_NAME)
            .insertOne(newUserModel)
            .finally(() => client.close());

        newUser && newUser.ops ? delete newUser.ops[0].password: newUser;
        return newUser.ops[0];
    });
}

module.exports = [createUser, login];