const jwt = require('jsonwebtoken');

function getTokenFromRequest(request) {
    return request.headers['authorization'];
}
  
async function verifyToken(token) {
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
        res.status(401).json({ success: false, message: 'unauthorized' });
    } else {
        //console.log("decoded: " + decodedToken);
        req.user = decodedToken;
        next();
    }
}

module.exports = {
    requireAuth,
    verifyToken,
}