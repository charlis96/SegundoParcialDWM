import jwt from 'jsonwebtoken';

const verificarToken = (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send({ message: 'No se proporcionó token de autenticación.' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'No autorizado.' });
        }
        req.usuario = decoded;
        next();
    });
};

export default verificarToken;