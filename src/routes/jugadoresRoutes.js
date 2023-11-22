import express from 'express';
import { getJugadores, getJugador, addJugador, deleteJugador, editJugador, getJugadoresConvocados, convocarJugadores } from '../controllers/jugadoresController.js';

const router = express.Router();

router.get('/', getJugadores);

router.get('/:id', getJugador);

router.post('/', addJugador);

router.delete('/:id', deleteJugador);

router.put('/:id', editJugador);

router.get('/', getJugadoresConvocados);

router.post('/', convocarJugadores);

export default router;