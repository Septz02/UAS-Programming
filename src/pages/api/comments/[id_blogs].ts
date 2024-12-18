import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "../../../lib/mongodb";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const idParam:string = req?.query?.id_blogs as string || ''

    switch (req.method) {  
        case "GET":
            try{
                const comment = await db.collection("comments")
                    .find({ id_blogs: idParam }).toArray();
                res.json({ data: comment });
            }catch(err){
                res.status(422).json({ message: err.message});
            }
        break;
    }
}