const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const express = require("express");
const ObjectID = require ("mongodb").ObjectID;


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




const uri = "mongodb+srv://organic:MYPASSWORD@cluster0.nky3scg.mongodb.net/mernstack?retryWrites=true&w=majority"

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

client.connect(err => {

  const productcollection = client.db("mernstack").collection ("users");
  console.log(" database connected ")

// read from the database
app.get("/products", (req, res) => {

  productcollection.find({}).limit(8)
  .toArray((err,documents) => {

    res.send (documents);

  })
})

app.get('/product/:id', (req, res) => {

  productcollection.find({_id: ObjectID(req.params.id)})
  .toArray ((err,documents) => {

    res.send (documents[0]);
  })
})



//insert from html form 
  app.post("/addProduct", (req,res) => {

    const product = req.body;
productcollection.insertOne(product)
.then(result => {
console.log("data added successfully");
// res.send("success");
res.redirect('/');
})

  })

app.patch('/update/:id', (req, res) => {
console.log (req.body.price);
  productcollection.updateOne({_id: ObjectID(req.params.id.trim())}, 
  
  {
    $set: {price: req.body.price, quantity: req.body.quantity} 

  })
  .then(result => {
     console.log(result); 
    res.send (result.modifiedCount > 0); 
  })



})

  app.delete('/delete/:id', (req,res)=>{
productcollection.deleteOne ({_id: ObjectID(req.params.id)})

.then(result => {
  // console.log(result);
  res.send (result.deletedCount > 0);
})
    // console.log(req.params.id);
  })


// insert manually one by one
  // const product = { name: "modhu", price: 25, quantity:20};
  // collection.insertOne(product)
  // .then(()=>{

  //   console.log("successfully added item");
  // }).catch((err)=> console.log("not added item") );
  
 
});



app.get('/',(req, res)=>{

    res.sendFile(__dirname + '/index.html');

    });



   





app.listen(3000);