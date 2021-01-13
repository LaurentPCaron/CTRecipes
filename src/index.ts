import express from "express";
import bodyparser from "body-parser"

const app =express();

app.use(bodyparser.urlencoded({extended:true}))

app.get('/',(req,res,next)=>{
    res.send(`One day, I'll be a beautifull website!`)
})

app.listen(3000,()=>{
    console.log('À l\'écoute boss!' )
})