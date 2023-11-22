import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.js';

const JWT_SECRET = process.env.JWT_SECRET;
let usuarios = [];

function generarTokenDeUsuario(usuario) {
    if (!JWT_SECRET) {
        throw new Error('La clave secreta JWT no está definida');
    }

    return jwt.sign({ id: usuario.id, nombre: usuario.nombre }, JWT_SECRET, { expiresIn: '1h' });
}

export async function register(req, res) {
    const { user, password } = req.body;
    const usuarioExistente = usuarios.find(u => u.user === user);

    if (usuarioExistente) {
        return res.status(409).send('El usuario ya existe.');
    }

    const hashedPassword = await Usuario.hashPassword(password);
    const nuevoUsuario = new Usuario(user, hashedPassword);
    usuarios.push(nuevoUsuario);

    res.status(201).send('Usuario registrado con éxito');
}

export async function login(req, res) {
    const { user, password } = req.body;
    const usuario = usuarios.find(u => u.user === user);

    if (!usuario || !(await usuario.compararPassword(password))) {
        return res.status(401).send('Credenciales incorrectas.');
    }

    const token = generarTokenDeUsuario(usuario);
    res.json({ token });
}
