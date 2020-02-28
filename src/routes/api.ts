const express = require('express');

const   Bot = require('../controllers/telegram');

const router = express.Router();

// router.post('/post', Post.createPost)
// router.put('/post/:id', Post.updatePost)
// router.delete('/post/:id', Post.deletePost)
router.get('/telegram-bot/:id', Bot.getMovie())
// router.get('/post', Post.getPosts)

module.exports = router;