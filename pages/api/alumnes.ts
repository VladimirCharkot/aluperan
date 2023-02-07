import { NextApiRequest, NextApiResponse } from "next"; 
import { get_alumnes, post_alumne } from '../../lib/alumnes';

export default async (req: NextApiRequest, res: NextApiResponse) => {
   try {
    if (req.method == 'GET') res.json(await get_alumnes());
    if (req.method == 'POST') res.json({id: await post_alumne(req.body)})
    if (req.method != 'POST' && req.method != 'GET') res.json({mensaje: 'Método no soportado'})
   } catch (e) {
       console.error(e);
   }
};