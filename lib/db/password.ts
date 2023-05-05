import clientPromise from './mongodb';
import { hash, compare } from 'bcrypt';

export const init_password = async (plaintext_password: string) => {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const hashed_password = await hash(plaintext_password, 10)

  const r = await db.collection('admin').insertOne({ id: 'password', value: hashed_password })

  return r.acknowledged
}

export const update_password = async (plaintext_password: string) => {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const hashed_password = await hash(plaintext_password, 10)

  const r = await db.collection('admin').updateOne({ id: 'password' }, { $set: { value: hashed_password } })

  return r.acknowledged
}

export const check_password = async (plaintext_password: string) => {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);
  const r = await db.collection('admin').findOne({id: 'password'})

  if (!r) { return null }
  
  // const hash
  return await compare(plaintext_password, r.value)
}

// init_password('test')