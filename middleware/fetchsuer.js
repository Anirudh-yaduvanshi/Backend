const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || '711690fe833af9af90b4484070ce4f11792dd9c7478eb4dde938e1fdf09f7763fd4b492ead3e4749f80e619abcc142390b0f1618b960372319f743451ce3cb2574401379b2fae0406550971554ccf67a5a0d226be26c96301c3ab8554e6f6c54df6803a06326041d8cd2fb7d6f629cb72fc884526ddc353ddec6952d893e65f25730cb4e7b2ce16630d9ed8d284104d75c7098769b3f8bde14de961bd03231fa3db14589fc48d893851c71ce519e727bb015bd73f34a92597cab18d11fa07fa78c42b9a9feb7ad7f1a2079d042b7e6c2f225ea468f8f38d0afedd6c8501e54fa91318801acfdb7b4f78a0a0130af4596c11bc108407c7306d8c47e3cdaccabaa';

const fetchuser = (req, res, next) => {
    // get user from authtoken from and add id to req
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).send({ error: 'please authenticate using a valid token ' }); //
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    }

catch (error) {
    res.status(401).send({ error: 'Invalid token ' });
}}

module.exports = fetchuser;