const express = require("express");
const body = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.set('view-engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));


//setting up mongo db
//step1 connect to the host and then to the database and add the useUnified and urlParser
mongoose.connect("mongodb://localhost:27017/wikiDB", { useUnifiedTopology: true, useNewUrlParser: true });
//step2 create a schema/collection
const articleSchema = {
    title: String,
    content: String,
};
//step3 create model mongoose
const Article = mongoose.model("Article", articleSchema);
//////////////////////// REQUESTS TARGETTING ALL ARTICLES
app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            }
            else {
                res.send(err);
            }
        })
    })
    .post(function (req, res) {
        console.log();
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("Sucessfully added a new article");
            }
            else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Sucessfully deleted all articles");
            }
            else {
                res.send(err);
            }
        });
    });
//////////////////////// REQUESTS TARGETTING SPECIIFC ARTICLES

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            }
            else {
                res.send("No article found with that title");
            }
        })

    })
    .put(function (req, res) {
        Article.update(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            function (err) {
                if (!err) {
                    res.send("Sucessfully updated article");
                }
                else {
                    res.send(err);
                }
            }
        )
    })

    .patch(function (req, res) {

        Article.update(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("Sucessfully updated article");
                }
                else {
                    res.send(err);
                }
            }
        );
    })
    .delete (function (req, res) {
    Article.deleteOne(
        { title: req.params.articleTitle },
        function (err) {
            if (!err) {
                res.send("Sucessfully deleted the article");
            }
            else {
                res.send(err);
            }
        }
    )
});
app.listen(3000, function () {
    console.log("Server up and running");
})