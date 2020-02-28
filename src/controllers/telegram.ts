// const Post = require('../models/post-model');

import from "express";

getMovie = (req:Request, res:Response,) => {
    const body = req.body
    // console.log(req.body);
    //
    // if (!body) {
    //     return res.status(400).json({
    //         success: false,
    //         error: 'You must provide a post',
    //     })
    // }
    // /home/slaweo/WEB/WEB_PROJECTS/next-node/server/server.ts
    //
    // const post = new Post(body)
    //
    // if (!post) {
    //     return res.status(400).json({ success: false, error: err })
    // }
    // post.save()

}


module.exports = {
    getMovie,
}