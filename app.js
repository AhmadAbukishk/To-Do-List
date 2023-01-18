//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Ahmad_Abukishk:Ahmad_SE2003@atlascluster.qpxnltf.mongodb.net/todolistDB?retryWrites=true&w=majority", {useNewUrlParser: true});
mongoose.set('strictQuery', false);

const itemSchema = {
  Name: String
}

const Item = mongoose.model("Item", itemSchema) 


const listSchema = {
  Name: String,
  Items: [itemSchema]
}

const List = mongoose.model("List", listSchema);

const workItems = [];
const items = ["Buy Food", "Cook Food", "Eat Food"];

const Item1 = new Item({
  Name: "Wake up"
})

const Item2 = new Item({
  Name: "Eat"
})

const Item3 = new Item({
  Name: "Sleep"
})

const defaultValue = [Item1, Item2, Item3];

app.get("/", function(req, res) {

  Item.find({}, (err, itemsFound)=>{
   
    if(Item.length === 0) {
      const item1 = new Item({
        Name: "Wake up"
      })
      
      const item2 = new Item({
        Name: "Eat"
      })
      
      const item3 = new Item({
        Name: "Sleep"
      })
      
      Item.insertMany([item1, item2, item3], (err)=>{
        if(err) console.log(err);
        else console.log("Success");
      });

      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: itemsFound});

    }
  })
 

const day = date.getDate();
});


app.get("/:cat", (req, res)=>{
  const cat = _.upperFirst(req.params.cat);
  console.log(cat);
  List.findOne({Name: cat}, (err, item)=>{
    if(err){
      console.log(err);
    } 
    console.log(defaultValue);
    if(!item){
      const list = new List({
        Name: cat, 
        Items: defaultValue
      }) 
      
      list.save();
      console.log("list created");
      res.redirect(`/${cat}`)
    } else {
      res.render("list", {listTitle: cat, newListItems: item.Items});
    }

  })
})

app.post("/", function(req, res){

  const userItem = req.body.newItem;
  const userList = _.upperFirst(req.body.list);

  const newItem = new Item({
    Name: userItem
  })

  if(userList == "Today"){
    Item.insertMany(newItem, (err)=>{
      if(err) console.log("Something went wrong");
    })
  
    res.redirect("/");
  } else {
    List.findOne({Name: userList}, (err, list)=>{
      list.Items.push(newItem);
      list.save();
      res.redirect(`/${userList}`);
    })
  }


 
});

app.post("/delete", function(req, res){
  const itm = req.body.checkbox;
  const listName = req.body.deleteItem;

  if(listName === "Today"){
    Item.findByIdAndRemove(itm, (err)=>{
      if(err){
         console.log(err);
      } else {
        res.redirect("/");
      }
    })
  } else {
    List.findOneAndUpdate({Name: listName}, {$pull: {Items: {_id: itm}}}, (err, foundItem)=> {
      if(!err){
        res.redirect(`/${listName}`)
      }
    })
  }

})
// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
