import { NextApiRequest, NextApiResponse } from "next";
import { get_inscripciones, post_inscripcion, put_inscripcion } from '../../lib/inscripciones';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method == 'GET') res.json(await get_inscripciones())
    if (req.method == 'POST') res.json(await post_inscripcion(req.body))
    if (req.method == 'PUT') res.json(await put_inscripcion(req.body))
    if (req.method != 'POST' && req.method != 'GET' && req.method != 'PUT')
      res.json({ mensaje: 'Método no soportado' })
  } catch (e) {
    console.error(e);
  }
};