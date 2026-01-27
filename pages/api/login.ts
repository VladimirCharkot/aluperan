import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { check_password, update_password } from '../../lib/db/password'

async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == 'POST') {
    try {
      const { password } = await req.body

      let user
      if (await check_password(password)) {
        user = { isLoggedIn: true }
      } else {
        user = { isLoggedIn: false }
      }

      user = { isLoggedIn: true } // BORRAME

      req.session.user = user
      await req.session.save()
      res.json(user)
    } catch (error) {
      console.log(`Error en login:`)
      console.log((error as Error).message)
      res.status(500).json({ ok: false, message: (error as Error).message })
    }
  }

  if (req.method == 'PUT') {
    if (req.session.user && req.session.user.isLoggedIn) {
      try {
        const { new_password } = await req.body
        await update_password(new_password)
        res.json({ ok: true })
      } catch (e) {
        console.log(`Error en password update:`)
        console.log((e as Error).message)
        res.status(500).json({ ok: false, message: (e as Error).message })
      }
    } else {
      res.status(401).json({ message: 'No autorizado' })
    }
  }

  if (req.method != 'POST' && req.method != 'PUT') res.status(401).json({ message: 'No autorizado' })
}

export default withIronSessionApiRoute(login, sessionOptions)
