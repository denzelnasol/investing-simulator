const jwt = require('jsonwebtoken');

function getTokenFromRequest(request) {
    return request.headers['authorization'];
}
  
async function verifyToken(token) {
    //console.log(token);

    try {
        return await jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
        console.log(err);
        return null;
    }
}
  
// middleware function to check user login
async function requireAuth(req, res, next) {
    const token = getTokenFromRequest(req);
    const decodedToken = await verifyToken(token);

    if (decodedToken === null) {
        res.status(401).json(UNAUTHORIZED_RESPONSE);
    } else {
        //console.log("decoded: " + decodedToken);
        req.user = decodedToken;
        next();
    }
}

module.exports = {
    requireAuth,
}