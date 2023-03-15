import { NextApiRequest, NextApiResponse } from "next"; 
import { get_asistencias, post_asistencias} from '../../lib/asistencias';

export default async (req: NextApiRequest, res: NextApiResponse) => {
   try {
    if (req.method == 'GET') {
      res.json(await get_asistencias(req.query.taller as string, req.query.mes ? new Date(req.query.mes as string) : undefined));
    }
    if (req.method == 'POST') res.json(await post_asistencias(req.body))
    if (req.method != 'POST' && req.method != 'GET') res.json({mensaje: 'Método no soportado'})
   } catch (e) {
       console.error(e);
   }
};