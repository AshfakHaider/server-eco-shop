const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ObjectID } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gt9oe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/',(req,res)=>{
    res.send('server side working no tension')
})
app.use(cors());
app.use(bodyParser.json());



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("eco-shop").collection("groceries");
//   posting products to the database
  app.post('/addProduct',(req,res)=>{
      console.log(req.body);
      const product = req.body;
      productCollection.insertOne(product)
      .then(result=>{
          console.log('inserted count',result.insertedCount);
          res.send(result.insertedCount>0)
      })
  })
// getting product from the database
 app.get('/products',(req,res)=>{
     productCollection.find()
     .toArray((err,items)=>{
        //console.log(items)
        res.send(items);
     })
 })
// delete product
    app.delete('/deleteProduct/:id',(req,res)=>{
        const id = ObjectID(req.params.id);
        console.log('delete ',id);
        productCollection.findOneAndDelete({_id:id})
         .then(documents=>{
             res.send(documents);
         })
    })

    
    
//   update product
    app.get('/product/:id',(req,res)=>{
        const id = ObjectID(req.params.id);
        console.log(id);
        productCollection.find({_id:id})
        .toArray((err,documents)=>{
            res.send(documents[0]);
        })
    })
    // updating
    app.patch('/updateProduct/:id',(req,res)=>{
        const id = ObjectID(req.params.id);
        productCollection.updateOne({_id:id},
            {
                $set:{name:req.body.name,price:req.body.price,piece:req.body.piece,brand:req.body.brand,category:req.body.category,imageUrl:req.body.imageUrl}
            })
        .then(result=>{
            console.log(result);
        })
    }) 
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
  