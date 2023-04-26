import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session';
import { NextApiRequest, NextApiResponse } from "next";
import { get_asistencias, post_asistencias } from '../../lib/asistencias';

const asistenciasRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = req.session.user
  if (!user || user.isLoggedIn === false) { res.status(401).json([]); return }

  try {
    if (req.method == 'GET') {
      res.json(await get_asistencias(req.query.taller as string, req.query.mes ? new Date(req.query.mes as string) : undefined));
    }
    if (req.method == 'POST') res.json(await post_asistencias(req.body))
    if (req.method != 'POST' && req.method != 'GET') res.json({ mensaje: 'Método no soportado' })
  } catch (e) {
    console.error(e);
  }
};

export default withIronSessionApiRoute(asistenciasRoute, sessionOptions)