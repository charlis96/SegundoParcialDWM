import Jugador from "../models/jugador.js";

let jugadores = [];
let jugadoresConvocados = [];

export function getJugadores(req, res) {
    const { name, position, suspended, injured } = req.query;

    let jugadoresFiltrados = jugadores;

    if (name) {
        jugadoresFiltrados = jugadoresFiltrados.filter(jugador => jugador.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (position) {
        jugadoresFiltrados = jugadoresFiltrados.filter(jugador => jugador.position == position);
    }

    if (suspended != undefined) {
        jugadoresFiltrados = jugadoresFiltrados.filter(jugador => jugador.suspended == suspended);
    }

    if (injured != undefined) {
        jugadoresFiltrados = jugadoresFiltrados.filter(jugador => jugador.injured == injured);
    }

    res.json(jugadoresFiltrados);
}

export function getJugador(req, res) {
    const { id } = req.params;

    const jugadorEncontrado = jugadores.find(jugador => jugador.id == id);

    if (!jugadorEncontrado) {
        return res.status(404).send('El jugador con el id especificado no existe.');
    }

    res.json(jugadorEncontrado);
}

export function addJugador(req, res) {

    const { name, position, suspended, injured } = req.body;

    if (!name || !position) {
        return res.status(400).send('Los campos name y position son obligatorios.');
    }

    if (position !== "GK" && position !== "DF" && position !== "MD" && position !== "FW") {
        return res.status(400).send('El campo position debe ser GK, DF, MD o FW.');
    }

    if (suspended != true && suspended != false) {
        return res.status(400).send('El campo suspended debe ser un booleano.');
    }

    if (injured != true && injured != false) {
        return res.status(400).send('El campo injured debe ser un booleano.');
    }

    const id = jugadores.length + 1;
    const nuevoJugador = new Jugador(id, name, position, suspended, injured);
    jugadores.push(nuevoJugador);
    res.status(201).json(nuevoJugador);
}

export function deleteJugador(req, res) {

    const { id } = req.params;

    const jugadorEncontrado = jugadores.find(jugador => jugador.id == id);

    if (!jugadorEncontrado) {
        return res.status(404).send('El jugador con el id especificado no existe.');
    }

    const jugadorConvocado = jugadoresConvocados.find(jugador => jugador.id == id);

    if (jugadorConvocado) {

        jugadoresConvocados = [];
        jugadores = jugadores.filter(jugador => jugador.id != id);

        res.status(200).send('La lista de jugadores convocados quedó vacía porque se eliminó un jugador convocado.');
    }

    jugadores = jugadores.filter(jugador => jugador.id != id);

    res.json(jugadorEncontrado);
}

export function editJugador(req, res) {

    const { id } = req.params;

    const jugadorEncontrado = jugadores.find(jugador => jugador.id == id);

    if (!jugadorEncontrado) {
        return res.status(404).send('El jugador con el id especificado no existe.');
    }

    const { position, suspended, injured } = req.body;

    if (position) {
        if (position !== "GK" && position !== "DF" && position !== "MD" && position !== "FW") {
            return res.status(400).send('El campo position debe ser GK, DF, MD o FW.');
        }
        jugadorEncontrado.position = position;
    }

    if (suspended != undefined) {
        if (suspended != true && suspended != false) {
            return res.status(400).send('El campo suspended debe ser un booleano.');
        }
        jugadorEncontrado.suspended = suspended;
    }

    if (injured != undefined) {
        if (injured != true && injured != false) {
            return res.status(400).send('El campo suspended debe ser un booleano.');
        }
        jugadorEncontrado.injured = injured;
    }

    res.json(jugadorEncontrado);
}

export function getJugadoresConvocados(req, res) {
    res.json(jugadoresConvocados);
}

export function convocarJugadores(req, res) {

    const { calledPlayersId } = req.body;

    if (!calledPlayersId) {
        return res.status(400).send('El campo ids es obligatorio.');
    }

    if (!Array.isArray(calledPlayersId)) {
        return res.status(400).send('El campo ids debe ser un array.');
    }

    if (calledPlayersId.length !== 22) {
        return res.status(400).send('El array de ids debe contener exactamente 22 jugadores.');
    }

    let jugadoresGK = 0;
    let jugadoresDF = 0;
    let jugadoresMD = 0;
    let jugadoresFW = 0;

    let jugadoresConvocadosTemp = [];

    calledPlayersId.forEach(id => {

        const jugadorEncontrado = jugadores.find(jugador => jugador.id == id);

        if (jugadorEncontrado) {

            if (jugadorEncontrado.suspended == true) {
                return res.status(400).send('No se puede convocar a un jugador suspendido.');
            }

            if (jugadorEncontrado.injured == true) {
                return res.status(400).send('No se puede convocar a un jugador lesionado.');
            }

            if (jugadorEncontrado.position == "GK") {
                jugadoresGK++;
            } else if (jugadorEncontrado.position == "DF") {
                jugadoresDF++;
            } else if (jugadorEncontrado.position == "MD") {
                jugadoresMD++;
            } else if (jugadorEncontrado.position == "FW") {
                jugadoresFW++;
            }

            jugadoresConvocadosTemp.push(jugadorEncontrado);

        } else {
            return res.status(400).send('No se encontró a uno de los jugadores del array.');
        }
    });

    if (jugadoresGK === 0 || jugadoresDF === 0 || jugadoresMD === 0 || jugadoresFW === 0) {
        return res.status(400).send('Se debe convocar por lo menos un jugador por posición.');
    }

    jugadoresConvocados = jugadoresConvocadosTemp;

    res.status(201).json(jugadoresConvocados);
}