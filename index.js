const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors")

app.use(cors())
app.use(express.json());

const uri = "mongodb+srv://eCommercePlatfrom:PIoByU8BMyLLoSn0@cluster0.ej1lu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const database = client.db('team001');
        const foodCollections = database.collection('foods');
        const clothCollections = database.collection('cloths');
        const electronicCollections = database.collection('electronics');
        const productCollections = database.collection('products');
        const cartCollection = database.collection("cart");

        
        app.get('/',(req,res)=>{
            res.send('Server Started')
        });
        
        app.get('/foods',async(req,res)=>{
            const cursor = foodCollections.find();
            const foods  = await cursor.toArray();
            res.json(foods)
        })
        app.get('/cloths',async(req,res)=>{
            const cursor = clothCollections.find();
            const cloths  = await cursor.toArray();
            res.json(cloths)
        })
        app.get('/electronics',async(req,res)=>{
            const cursor = electronicCollections.find();
            const electronics  = await cursor.toArray();
            res.json(electronics)
        })
        app.get('/products',async(req,res)=>{
            const cursor = productCollections.find();
            const products  = await cursor.toArray();
            res.json(products)
        })
        app.get('/foods/:id',async (req,res)=>{
            const  id = req.params.id;
            const query = { _id : ObjectId(id)}
            const foods = await foodCollections.findOne(query)
            console.log(id)
            res.send(foods)
         });
        app.get('/products/:id',async (req,res)=>{
            const  id = req.params.id;
            const query = { _id : ObjectId(id)}
            const product = await productCollections.findOne(query)
            console.log(id)
            res.send(product)
         });
        app.get('/cloths/:id',async (req,res)=>{
            const  id = req.params.id;
            const query = { _id : ObjectId(id)}
            const cloth = await clothCollections.findOne(query)
            console.log(id)
            res.send(cloth)
         });
        app.get('/electronics/:id',async (req,res)=>{
            const  id = req.params.id;
            const query = { _id : ObjectId(id)}
            const electronic = await electronicCollections.findOne(query)
            console.log(id)
            res.send(electronic)
         });
         app.get('/cart/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { email: email };
            const cursor = await cartCollection.find(query);
            const result = await cursor.toArray();
            console.log('result is', result);
            res.json(result);
        }); 
         
         app.post('/cart', async (req, res) => {
            const order = req.body;
            console.log('order is', order);
            const query = { _id: order._id };
            const result = await cartCollection.findOne(query);
            if (result) {
                const filter = { _id: order._id }
                console.log(result);
                const newQuantity = result.quantity + 1;
                console.log('new quantiy is', newQuantity);
                const updateDoc = { $set: { quantity: newQuantity } };
                const result2 = await cartCollection.updateOne(filter, updateDoc);
                console.log('if exist', result2);
                res.json(result2)
            }
            else {
                console.log('oder before adding quantiyy', order);
                order.quantity = 1;
                console.log('oder after adding quantiyy', order);   
                const result2 = await cartCollection.insertOne(order);
                console.log('if dont exist', result2);
                res.json(result2);
            }
            
        });

    }finally{

    }
}

run().catch(console.dir)







app.listen(port,(req,res)=>{
    console.log('Server Started')
})