let app = require('express')();
let bodyParser = require('body-parser') ;
let port = 9999;


let mongoClient = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017"

app.use(bodyParser.urlencoded({extended:true}));    // enable body part data  
app.use(bodyParser.json());                         // json data. 


app.get("/" , (req,res) => {
    res.sendFile(__dirname + "/index.html") ;
});

app.get("/delete" , (req,res) => {
    res.sendFile(__dirname + "/delete.html") ;
});


app.get("/fetch" , (req,res) => {
    res.setHeader("content-type" , "text/html") ; 
    mongoClient.connect(url, {useUnifiedTopology: true },(err1,client)=>{
        if(!err1){
            let db = client.db("Course");
            db.collection("Course").find({}).toArray(function(err, result) {
                // res.send(result) ;
               res.send(result) ;

             });
            
        };
    })
}) ;
         
    
app.get("/update" , (req,res) => {
    res.sendFile(__dirname + "/update.html") ;
});

app.get("/add" , (req,res) => {
    res.sendFile(__dirname + "/add.html") ;
});


// Add Course : DONE
app.post("/add" , (req,res) => {

    var id = req.body.cid ;
    var cname = req.body.cname ;
    var desc = req.body.desc ;
    var price = req.body.amount ;

mongoClient.connect(url, {useUnifiedTopology: true },(err1,client)=>{
if(!err1){
    let db = client.db("Course");
    db.collection("Course").insertOne({
        
        _id: parseInt(id),
        CName:cname,
        Description: desc, 
        Amount : parseInt(price)
    }, 
        
        (err2,result)=>{
         
            if(!err2){
                console.log(result.insertedCount);
            }else {
                console.log(err2.message);
            }
          
            client.close();    
    
        });
        
    }
});

    res.send("Record Save Successfully  !") ;
});



//Delete Course : DONE
app.post("/delete" , (req,res) => {
    
     var id = parseInt(req.body.cid);
     console.log(id) ;

     mongoClient.connect(url, {useUnifiedTopology: true },(err1,client)=>{
        if(!err1){
            let db = client.db("Course");
            db.collection("Course").deleteOne({ _id : id },(err,result)=> {
                if(!err){
                       
                 res.send("Record deleted successfully")
                       
                }else {
                    res.send("Error generated "+err);
                }
            })
        }
                
     });
});



//Update Course : DONE
app.post("/update" , (req,res) => {
    
    var id = parseInt(req.body.cid);
    var amount = parseInt(req.body.price);
    
    console.log(id) ;

    mongoClient.connect(url, {useUnifiedTopology: true },(err1,client)=>{
           if(!err1){
               let db = client.db("Course");
               db.collection("Course").updateOne({ _id : id },{$set: { Amount : amount}},(err,result)=> {
                if(!err){
                  
                    res.send("Record updated succesfully")
                           
                }else {
                    res.send("Error generated "+err);
                }
               })
           }
                   
        });
});



app.listen(port,()=>console.log("Server running on port number 9999"));


