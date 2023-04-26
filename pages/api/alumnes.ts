import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session';
import { NextApiRequest, NextApiResponse } from "next";
import { get_alumnes, post_alumne, put_alumne } from '../../lib/alumnes';

const alumnesRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = req.session.user
  console.log(`Request a alumnes`)
  console.log(`user:`)
  console.log(user)
  if (!user || user.isLoggedIn === false) { console.log(`Unauthorized`); res.status(401).json([]); return }

  console.log(`Autorizado`)
  try {
    if (req.method == 'GET')  res.json(await get_alumnes());
    if (req.method == 'POST') res.json(await post_alumne(req.body))
    if (req.method == 'PUT')  res.json(await put_alumne(req.body))
    if (req.method != 'POST' && req.method != 'GET' && req.method != 'PUT') res.json({ mensaje: 'Método no soportado' })
  } catch (e) {
    console.error(e);
  }
};

export default withIronSessionApiRoute(alumnesRoute, sessionOptions)