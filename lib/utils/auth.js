const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET_KEY;

function createToken(data) {
    return jwt.sign(data, secret, { algorithm: 'HS256', expiresIn: '1h'});
}

function checkToken(req, res, next){
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if(token && token.startsWith('Bearer ')){
        token = token.split(' ')[1];
        return validateToken(token, req, res, next);
    }else {
        return res.json( {
            success: false,
            message: 'Auth token is not supplied'
        });
    }
}

function validateToken(token, req, res, next){
    jwt.verify( token, secret, (err, decoded ) => {
        if ( err ){
            return res.send(401).json({
                success: false,
                message: 'Token is not valid'
            });
        }else {
            req.decoded = decoded;
            next();
        }
    });
}

module.exports = { checkToken: checkToken, validateToken: validateToken, createToken: createToken}