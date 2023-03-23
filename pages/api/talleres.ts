import { NextApiRequest, NextApiResponse } from "next"; 
import { get_talleres, post_taller, put_taller } from '../../lib/talleres';

export default async (req: NextApiRequest, res: NextApiResponse) => {
   try {
      if(req.method == 'GET') res.json(await get_talleres())
      if(req.method == 'POST') res.json(await post_taller(req.body))
      if(req.method == 'PUT') res.json(await put_taller(req.body))
      if(req.method != 'POST' && req.method != 'GET' && req.method != 'PUT') res.json({mensaje: 'Método no soportado'}) 
   } catch (e) {
       console.error(e);
   }
};
