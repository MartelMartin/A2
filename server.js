const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./productModel');
const app = express();
const MONGODB_URL = 'mongodb://localhost:27017/Marketplace'; //Connect to the db
const PORT = 3000;
app.use(express.json()); // This allows you to use JSON data in POST requests
app.use(cors());
mongoose.connect(MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{console.log('Connected to MongoDB')})
.catch(error =>{console.error('Error connecting to MongoDB:',error.message)});
app.get('/', (req, res) => {  
    res.json({ "message": "Welcome to Marketplace application." });
});
//get
app.get('/api/products', async(req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
      } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Error fetching products' });
      }
});
//post
  app.post('/api/products', async (req, res) => {
    const product = new Product(req.body);
    try {
        const savedProduct = await product.save();
        res.json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error.message);
        res.status(500).json({ message: 'Error creating product' });
    }
});
//put
app.put('/api/products/:_id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params._id, req.body, { new: true });
        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({ message: 'Error updating product' });
    }
});
//delete
app.delete('/api/products/:_id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndRemove(req.params._id);
        if (deletedProduct) {
            res.json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});