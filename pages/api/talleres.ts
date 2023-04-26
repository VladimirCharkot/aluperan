import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session';
import { NextApiRequest, NextApiResponse } from "next";
import { get_talleres, post_taller, put_taller } from '../../lib/talleres';

const talleresRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = req.session.user
  if (!user || user.isLoggedIn === false) { res.status(401).json([]); return }

  try {
    if (req.method == 'GET') res.json(await get_talleres())
    if (req.method == 'POST') res.json(await post_taller(req.body))
    if (req.method == 'PUT') res.json(await put_taller(req.body))
    if (req.method != 'POST' && req.method != 'GET' && req.method != 'PUT') res.json({ mensaje: 'Método no soportado' })
  } catch (e) {
    console.error(e);
  }
};

export default withIronSessionApiRoute(talleresRoute, sessionOptions)