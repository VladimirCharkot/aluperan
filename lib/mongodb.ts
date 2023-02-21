import { MongoClient } from 'mongodb'
import { readFileSync, statSync } from 'fs';

let uri
try{
  const envExists = statSync('../.env.local').isFile()
  let envUri: string | undefined = undefined
  if(envExists) envUri = readFileSync('../.env.local', 'utf-8').split('=')[1].split('?')[0]
  uri = process.env.MONGODB_URI || envUri
}catch{
  uri = process.env.MONGODB_URI
}

if (!uri) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
