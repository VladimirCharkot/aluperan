import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session';
import { NextApiRequest, NextApiResponse } from "next";
import { AlmacenMovimientos } from '../../lib/movimientos';

const movimientosRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = req.session.user
  if (!user || user.isLoggedIn === false) { res.status(401).json([]); return }

  const movimientos = await AlmacenMovimientos.build()
  try {
    if (req.method == 'GET') res.json(await movimientos.get());
    if (req.method == 'POST') res.json(await movimientos.post(req.body))
    if (req.method != 'POST' && req.method != 'GET') res.json({ mensaje: 'Método no soportado' })
  } catch (e) {
    console.error(e);
  }
};

export default withIronSessionApiRoute(movimientosRoute, sessionOptions)