import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "../../../lib/mongodb";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);

    switch (req.method) {
        case "GET":
            try {
                const { search } = req.query;
                let query = {};
                if (search) {
                    query = {
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { subTitle: { $regex: search, $options: 'i' } },
                            { content: { $regex: search, $options: 'i' } },
                        ]
                    };
                }
                const blogsData = await db.collection("blogs").find(query).toArray();
                res.status(200).json({ data: blogsData });
            } catch (err) {
                res.status(500).json({ message: 'Error fetching blogs', error: err.message });
            }
            break;

        case "POST":
            try{
                // const body = req.body
                const body = JSON.parse(req.body)
                if(typeof body !== "object"){
                    throw new Error('invalid request')
                }
                
                if( body.title == ""){
                    throw new Error('title is required')
                }

                if( body.subTitle == ""){
                    throw new Error('subTitle is required')
                }

                if( body.category == ""){
                    throw new Error('category is required')
                }

                if( body.content == ""){
                    throw new Error('content is required')
                }

                let blogs = await db.collection("blogs").insertOne(body);
                res.status(200).json({ data: blogs, message:'data berhasil di simpan' });

            }catch(err){
                res.status(422).json({ message: err.message});
            }
            break;
        default:
            const blogsData = await db.collection("blogs").find({}).toArray();
            res.json({ data: blogsData });
        break;
    }
}