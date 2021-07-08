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
  const fashionCollection = client.db("eco-shop").collection("fashion");
  const foodCollection = client.db("eco-shop").collection("food");
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

  app.post('/addFashion',(req,res)=>{
    console.log(req.body);
    const fashionPd = req.body;
    fashionCollection.insertOne(fashionPd)
    .then(result=>{
        console.log('inserted count',result.insertedCount);
        res.send(result.insertedCount>0)  
    })
    
})
app.post('/addFood',(req,res)=>{
    console.log(req.body);
    const foodPd = req.body;
    foodCollection.insertOne(foodPd)
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
 app.get('/foodProducts',(req,res)=>{
    foodCollection.find()
    .toArray((err,items)=>{
       //console.log(items)
       res.send(items);
    })
})
app.get('/fashionProducts',(req,res)=>{
    fashionCollection.find()
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

    app.delete('/deleteFashion/:id',(req,res)=>{
        console.log(req.params.id)
        fashionCollection.findOneAndDelete({_id:ObjectID(req.params.id)})
        .then(documents=>{
            res.send(documents)
        })
    })

   app.delete('/deleteFood/:id',(req,res)=>{
       foodCollection.findOneAndDelete({_id:ObjectID(req.params.id)})
       .then(documents=>{
           res.send(documents)
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

    app.get('/food/:id',(req,res)=>{
        foodCollection.find({_id:ObjectID(req.params.id)})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })

    app.get('/fashion/:id',(req,res)=>{
        fashionCollection.find({_id:ObjectID(req.params.id)})
        .toArray((err,documents)=>{
            res.send(documents)
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

    app.patch('/updateFashion/:id',(req,res)=>{

        fashionCollection.updateOne({_id:ObjectID(req.params.id)},
            {
                $set:{name:req.body.name,price:req.body.price,piece:req.body.piece,brand:req.body.brand,category:req.body.category,imageUrl:req.body.imageUrl}
            })
        .then(result=>{
            console.log(result);
        })
    }) 
    app.patch('/updateFood/:id',(req,res)=>{
        foodCollection.updateOne({_id:ObjectID(req.params.id)},
            {
                $set:{name:req.body.name,price:req.body.price,piece:req.body.piece,brand:req.body.brand,category:req.body.category,imageUrl:req.body.imageUrl}
            })
        .then(result=>{
            console.log(result);
        })
    }) 


// getting similar product statically

    app.get('/category/sanitizer',(req,res)=>{
        productCollection.find({"category":"Hand Sanitizer"})
        .toArray((err,documents)=>{
            res.send(documents)
            // console.log(documents);
        })
    })
    app.get('/category/sugar',(req,res)=>{
        productCollection.find({"category":"Sugar"})
        .toArray((err,documents)=>{
            res.send(documents);
            // console.log(documents)
        })
    })
    app.get('/category/spray',(req,res)=>{
        productCollection.find({"category":"Disinfectant Spray"})
        .toArray((err,documents)=>{
            res.send(documents);
            // console.log(documents)
        })
    })
    app.get('/category/wash',(req,res)=>{
        productCollection.find({"category":"Hand Wash"})
        .toArray((err,documents)=>{
            res.send(documents);
            // console.log(documents)
        })
    })
    app.get('/category/diaper',(req,res)=>{
        productCollection.find({"category":"Baby Diaper"})
        .toArray((err,documents)=>{
            res.send(documents);
            // console.log(documents)
        })
    })
    app.get('/category/bodySpray',(req,res)=>{
        productCollection.find({"category":"Body Spray"})
        .toArray((err,documents)=>{
            res.send(documents);
            // console.log(documents)
        })
    })
    // woking function but have some re-render problem in front-end hope we will fix it
    // app.get('/productSimilar/:id',(req,res)=>{
    //     //console.log(req.params.id);
    //     const category = req.params.id;
    //     productCollection.find({"category":category})
    //     .toArray((err,documents)=>{
    //         console.log(documents)
    //         res.send(documents)
    //     })
    // })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
  