import { NextApiRequest, NextApiResponse } from "next"; 
import { AlmacenMovimientos } from '../../lib/movimientos';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const movimientos = await AlmacenMovimientos.build()
   try {
       if (req.method == 'GET') res.json(await movimientos.get());
       if (req.method == 'POST') res.json({id: movimientos.post({...req.body, fecha: new Date(req.body.fecha)})})
       if (req.method != 'POST' && req.method != 'GET') res.json({mensaje: 'Método no soportado'})
   } catch (e) {
       console.error(e);
   }
};