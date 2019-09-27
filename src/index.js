const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://longanh143:741852@cluster0-owwrf.mongodb.net/test?retryWrites=true&w=majority');


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://longanh143:741852@cluster0-owwrf.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//     const collection = client.db("appshop").collection("products");
//     // perform actions on the collection object
//     collection.find({ 'category': 'adidas' }).toArray(function (err, docs) {
//         console.log("Found the following records");
//         console.log(docs)
//     });

//     client.close();
// });



const Product = require('./model/product.model');
const Users = require('./model/user.model');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// http://localhost:3000/products?category=nameproduct
app.get('/products',
    (req, res) => {
        console.log(req.query.category);
        
        // // Query data to localhost
        // Product.find({ category: req.query.category }).then(
        //     (product) => {
        //         res.send(product);
        //     }
        // );

        // query data to mongodb Atlas
        client.connect(err => {
            const collection = client.db("appshop").collection("products");
            // perform actions on the collection object
            collection.find({ "category": req.query.category }).toArray(function (err, docs) {
                console.log("Found the following records");
                if (!!docs) {
                    res.json(docs);
                    console.log(docs);
                }else{
                    res.json([]);
                    console.log(err);
                }
            });

            client.close();
        });
    }
);

// http://localhost:3000/users?name=Linh%20Nguyen&pass=123456
app.get('/users',
    (req, res) => {
        const { email, password } = req.query;

        // // Query data to localhost

        // Users.find({
        //     email: name,
        //     password: pass
        // }).then(
        //     user => res.status(200).json(user)
        // );

        // Query data to mongodb Atlas
        client.connect(err => {
            const collection = client.db("appshop").collection("users");
            // perform actions on the collection object
            collection.find({ email, password }).toArray(function (err, docs) {
                console.log("Found the following records");
                console.log(docs);
                res.json(docs);
            });

            client.close();
        });
    }
)
//http://localhost:3000/users
app.post('/users',
    (req, res) => {
        const { email, password } = req.body;
        // Users.find({
        //     email: name,
        //     password: pass
        // }).then(
        //     (x) => {
        //         console.log(x);
        //         if (x.length) {
        //             res.json({
        //                 status: 200,
        //                 message: 'Dang nhap thanh cong'
        //             })
        //         } else {
        //             res.json({
        //                 status: 300,
        //                 message: 'Tai khoan hoac mat khau khong ton tai'
        //             })
        //         }

        //     }
        // ).catch(
        //     (err) => {
        //         res.json({
        //             status: 400,
        //             err: err
        //         })
        //     });

        // Query data to mongodb Atlas
        client.connect(err => {
            const collection = client.db("appshop").collection("users");
            // perform actions on the collection object
            collection.find({ email, password }).toArray(function (err, docs) {
                console.log("Found the following records");
                console.log(docs);
                if (!!docs) {
                    res.json({
                        status: 200,
                        message: 'Dang nhap thanh cong'
                    });
                } else {
                    res.json({
                        status: 300,
                        message: 'Tai khoan hoac mat khau khong ton tai'
                    })
                }
            });

            client.close();
        });

    }
)
// npm install node-rsa
const NodeRSA = require('node-rsa');
const axios = require('axios');
// using your public key get from https://business.momo.vn/
//const fs = require('fs');
//const pubKey = fs.readFileSync('rsa.pub');
const pubKey = '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkpa+qMXS6O11x7jBGo9W3yxeHEsAdyDE40UoXhoQf9K6attSIclTZMEGfq6gmJm2BogVJtPkjvri5/j9mBntA8qKMzzanSQaBEbr8FyByHnf226dsLt1RbJSMLjCd3UC1n0Yq8KKvfHhvmvVbGcWfpgfo7iQTVmL0r1eQxzgnSq31EL1yYNMuaZjpHmQuT24Hmxl9W9enRtJyVTUhwKhtjOSOsR03sMnsckpFT9pn1/V9BE2Kf3rFGqc6JukXkqK6ZW9mtmGLSq3K+JRRq2w8PVmcbcvTr/adW4EL2yc1qk9Ec4HtiDhtSYd6/ov8xLVkKAQjLVt7Ex3/agRPfPrNwIDAQAB-----END PUBLIC KEY-----';

const key = new NodeRSA(pubKey, { encryptionScheme: 'pkcs1' });

// http://localhost:3000/paymentMOMO
app.post('/paymentMOMO',
    (req, res) => {
        const response = req.body;
        console.log(response);

        const jsonData = {
            partnerCode: response.partnerCode,
            partnerRefId: response.partnerRefId,
            amount: response.amount,
            partnerTransId: response.partnerTransId,
            customerNumber: response.customerNumber,
        };
        const encrypted = key.encrypt(JSON.stringify(jsonData), 'base64');
        console.log('encrypted: ', encrypted);
        axios.post('https://test-payment.momo.vn/pay/app', {
            customerNumber: response.customerNumber,
            partnerCode: response.partnerCode,
            partnerRefId: response.partnerRefId,
            appData: response.appData,
            hash: encrypted,
            description: response.description,
            version: 2
        }).then(
            resMM => {
                console.log(resMM.data);
                res.json({ resMOMO: resMM.data });
            }
        ).catch(
            err => {
                console.log("Loi Post Server to momo : ", err);

            }
        );
    }
)
app.listen(port,
    () => {
        console.log('start port: ' + port);
    }
)