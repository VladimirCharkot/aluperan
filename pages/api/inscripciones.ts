import { NextApiRequest, NextApiResponse } from "next"; 
import { get_inscripciones, post_inscripcion } from '../../lib/inscripciones';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
      if (req.method == 'GET') res.json(await get_inscripciones());
      if (req.method == 'POST') res.json({id: await post_inscripcion(req.body)})
      if (req.method != 'POST' && req.method != 'GET') res.json({mensaje: 'Método no soportado'})
  } catch (e) {
      console.error(e);
  }
};