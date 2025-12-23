import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session';
import { NextApiRequest, NextApiResponse } from "next";
import { almacenTalleres } from '../../lib/db/talleres';

const talleresRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = req.session.user
  if (!user || user.isLoggedIn === false) { res.status(401).json([]); return }

  try {
    if (req.method == 'GET')  res.json(await almacenTalleres.getAllJoined())
    if (req.method == 'POST') res.json(await almacenTalleres.create(req.body))
    if (req.method == 'PUT')  res.json(await almacenTalleres.update(req.body))
    if (req.method && !['POST', 'GET', 'PUT'].includes(req.method)) res.json({ mensaje: 'Método no soportado' })
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ 
      message: err.message || 'Error interno del servidor' 
    });
  }
};

export default withIronSessionApiRoute(talleresRoute, sessionOptions)