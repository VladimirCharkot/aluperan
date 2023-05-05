import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session';
import { NextApiRequest, NextApiResponse } from "next";
import { almacenMovimientos } from '../../lib/db/movimientos';

const movimientosRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = req.session.user
  if (!user || user.isLoggedIn === false) { res.status(401).json([]); return }

  try {
    if (req.method == 'GET')    res.json(await almacenMovimientos.getAll());
    if (req.method == 'POST')   res.json(await almacenMovimientos.create(req.body))
    if (req.method == 'PUT')    res.json(await almacenMovimientos.update(req.body))
    if (req.method == 'DELETE') res.json(await almacenMovimientos.delete(req.body))
    if (req.method && !['GET', 'POST', 'PUT', 'DElETE'].includes(req.method)) res.json({ mensaje: 'Método no soportado' })
  } catch (e) {
    console.error(e);
  }
};

export default withIronSessionApiRoute(movimientosRoute, sessionOptions)