import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "../../../lib/mongodb";
import { setCookie  } from 'cookies-next';
import { comparePassword, encrypt} from "../../../lib/session"


export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);

    switch (req.method) {
        case "POST":
            try{
                const body = JSON.parse(req.body)

                if( body.email == ""){
                    throw new Error('email is required')
                }

                if( body.password == ""){
                    throw new Error('password is required')
                }

                const users = await db.collection("users")
                    .find({email: body.email }).toArray(); 

                if( users.length > 0 && await comparePassword(body.password, users[0].password )){
                    const tokenData = {
                        id:users[0]._id,
                        email:users[0].email,
                        name:users[0].name,
                    }

                    setCookie(`${process.env.AUTH_COOKIE_NAME}`, await encrypt(tokenData), { req, res, maxAge: 60 * 6 * 24 });
                }else{
                    throw new Error('invalid username and password')
                }
                

                res.status(200).json({message: 'login berhasil'});
            }catch(err){
                res.status(422).json({ message: err.message});
            }
            break;
        default:
            res.status(404).json({message: "page not found"});
        break;
    }
}