import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session';
import { NextApiRequest, NextApiResponse } from "next";
import { almacenAlumnes } from '../../lib/db/alumnes';

const alumnesRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = req.session.user
  if (!user || user.isLoggedIn === false) { console.log(`Unauthorized`); res.status(401).json([]); return }

  try {
    if (req.method == 'GET')  res.json(await almacenAlumnes.getAllJoined());
    if (req.method == 'POST') res.json(await almacenAlumnes.create(req.body))
    if (req.method == 'PUT')  res.json(await almacenAlumnes.update(req.body))
    // if (req.method == 'DELETE')   res.json(await almacenAlumnes.delete(req.body))
    if (req.method && !['GET', 'POST', 'PUT'].includes(req.method)) res.json({ mensaje: 'Método no soportado' })
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ 
      message: err.message || 'Error interno del servidor' 
    });
  }
};

export default withIronSessionApiRoute(alumnesRoute, sessionOptions)