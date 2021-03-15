const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blogs");
const { render } = require("ejs");
const methodOverride = require('method-override')
const app = express();

//CONNECTION TO MONGODB
const dbURL ="mongodb+srv://naveed:test1234@cluster0.s244r.mongodb.net/node-tuts?retryWrites=true&w=majority";
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true }).then((result) => {
  console.log("connected to data base++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  app.listen(3000);
}).catch((err) => console.log(err));

//REGISTER VIEW ENGINE ---------------------------------------------------

app.set("view engine","ejs"); 

// THIRD PARTY MIDDLEWARES-------------------------------------------------
// app.use(morgan('tiny'));

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
// app.use(morgan('dev'));

//ADDING DELETING RETRIVING DATA FROM DATABASE MONDODB WITH MONGOOSE ----------------

app.get("/add-blogs", (request, response) => {
  const blog = new Blog({
    title: "new blog 3",
    snippet: "about my new blog",
    body: "more about my new blog"
  });
  
  blog.save().then((result) => {
    response.send(result);
  }).catch((err) => {
    console.log(err);
  });
});

app.get("/all-blogs", (request,response) => {
  Blog.find().then((result) => {
    response.send(result)
  }).catch((err) => {
    console.log(err);
  });
});

app.get('/single-blog',(request,response)=>{
  Blog.findById('6048f379a178de0664a54508').then((result)=>{
    response.send(result)
  }).catch((err)=>{
    console.log(err)
  })
})

//LISTEN FOR REQUEST -----------------------------------------------------
app.get("/", (request, response) => {
  response.redirect('/blogs')
});
app.get('/blogs',(request,response)=>{
  Blog.find().sort({createdAt:-1}).then((result)=>{
    response.render('index',{title:"all-Blogs",blogs:result})
  })
})
app.post('/blogs',(request,response)=>{
  const blog = new Blog(request.body)
  blog.save().then((result)=>{
    response.redirect('/blogs')
  }).catch((err)=>{
    console.log(err)
  })
})
app.get("/about", (request, response) => {
  response.render("about", { title: "About" });
});
app.get("/blogs/create", (request, response) => {
  response.render("create", { title: "Create A New Blog" });
});
app.get('/blogs/:id', (request,response)=>{
  const id = request.params.id;
  Blog.findById(id).then((result)=>{
    response.render('details',{blog:result,title:'blog details'})
  }).catch((err)=>{
    response.status(404).render("404", { title: "404" });
  })
})
app.delete('/blogs/delete/:id',(request,response)=>{
  const id = request.params.id;
  console.log(id);
  Blog.findByIdAndDelete(id).then((result)=>{
    response.redirect('/blogs')
  }).catch((err)=>{
    console.log(err)
  })
})

// REDIRECTING -----------------------------------------------------------
app.get("/about-us", (request, response) => {
  response.redirect("/about", { title: "About" });
});

// 404 PAGE --------------------------------------------------------------
app.use((request, response) => {
  response.status(404).render("404", { title: "404" });
});