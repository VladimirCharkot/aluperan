import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session';
import { NextApiRequest, NextApiResponse } from "next";
import { almacenAsistencias } from '../../lib/db/asistencias';

const asistenciasRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = req.session.user
  if (!user || user.isLoggedIn === false) { res.status(401).json([]); return }

  try {
    if (req.method == 'GET')  res.json(await almacenAsistencias.getForTaller(req.query.taller as string, req.query.mes ? new Date(req.query.mes as string) : undefined)) 
    if (req.method == 'POST') res.json(await almacenAsistencias.createMany(req.body))
    if (req.method && !['POST', 'GET'].includes(req.method)) res.json({ mensaje: 'Método no soportado' })
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ 
      message: err.message || 'Error interno del servidor' 
    });
  }
};

export default withIronSessionApiRoute(asistenciasRoute, sessionOptions)