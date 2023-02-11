import { NextApiRequest, NextApiResponse } from "next"; 
import { get_asistencias, post_asistencia } from '../../lib/asistencias';

export default async (req: NextApiRequest, res: NextApiResponse) => {
   try {
    if (req.method == 'GET') res.json(await get_asistencias());
    if (req.method == 'POST') res.json({id: await post_asistencia(req.body)})
    if (req.method != 'POST' && req.method != 'GET') res.json({mensaje: 'Método no soportado'})
   } catch (e) {
       console.error(e);
   }
};