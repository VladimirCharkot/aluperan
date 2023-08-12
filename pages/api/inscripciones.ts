import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session';
import { NextApiRequest, NextApiResponse } from "next";
import { almacenInscripciones } from '../../lib/db/inscripciones';

const inscripcionesRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = req.session.user
  if (!user || user.isLoggedIn === false) { res.status(401).json([]); return }

  // await almacenInscripciones.purgar()

  try {
    if (req.method == 'GET') res.json(await almacenInscripciones.getAllJoined())
    if (req.method == 'POST') res.json(await almacenInscripciones.create(req.body))
    if (req.method == 'PUT') res.json(await almacenInscripciones.update(req.body))
    if (req.method && !['POST', 'GET', 'PUT'].includes(req.method)) res.json({ mensaje: 'Método no soportado' })
  } catch (e) {
    console.error(e);
  }
};

export default withIronSessionApiRoute(inscripcionesRoute, sessionOptions)