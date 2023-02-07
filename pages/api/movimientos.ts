import { NextApiRequest, NextApiResponse } from "next"; 
import { get_movimientos, post_movimiento } from '../../lib/movimientos';

export default async (req: NextApiRequest, res: NextApiResponse) => {
   try {
       if (req.method == 'GET') res.json(await get_movimientos());
       if (req.method == 'POST') res.json({id: await post_movimiento({...req.body, fecha: new Date(req.body.fecha)})})
       if (req.method != 'POST' && req.method != 'GET') res.json({mensaje: 'Método no soportado'})
   } catch (e) {
       console.error(e);
   }
};