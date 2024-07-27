const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

// Define post schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model('Blogs', postSchema);

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// API to get posts
app.get('/api/posts', (req, res) => {
    Post.find({}, (err, posts) => {
        if (!err) {
            res.json(posts);
        } else {
            res.status(500).send(err);
        }
    });
});

// API to get a specific post
app.get('/api/posts/:postId', (req, res) => {
    const requestedPostId = req.params.postId;

    Post.findOne({ _id: requestedPostId }, (err, post) => {
        if (!err) {
            res.json(post);
        } else {
            res.status(500).send(err);
        }
    });
});

// Compose route to handle post submission
app.post('/compose', (req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postContent
    });

    post.save((err) => {
        if (!err) {
            res.redirect('/');
        } else {
            res.status(500).send(err);
        }
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
