import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session'
import { NextApiRequest, NextApiResponse } from "next"

async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { password } = await req.body

    let user
    if(password == 'ojota'){
      user = { isLoggedIn: true }
    }else{
      user = { isLoggedIn: false }
    }

    req.session.user = user
    await req.session.save()
    res.json(user)

  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export default withIronSessionApiRoute(login, sessionOptions)