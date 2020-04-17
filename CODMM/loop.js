const mysql = require('mysql')

const express = require('express')
const app = express()

var sql = `cmd`;
var cmd = `cmd`;
var count = 0;
var matchedKids;
var lastSuccessCount = 0;
var lastSuccessJSON = 0;

//// ESTABLISH MYSQL CONNECTION
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "codmm"
});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
//////////////////////
//FIXING CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
///

ourLoop();
var i=1;

function ourLoop(){
       
    setInterval(function() {
    //TODO:  
        countActivePlayers();
        i = i + 1;               

    }, 100);

}

function countActivePlayers(){

    cmd = `select count(0) from activePlayers`;     
    
    con.query(cmd, function (err, result) {
        //console.log("NORMAL UPDATE");
        if (err) throw err;
            var str = JSON.stringify(result);
            str = str.replace("count(0)","count");
            var json = JSON.parse(str);
            count = json[0].count;
    });  
    
    
    if(i % 40 == 0){ //Remove the disconnected bitches every 4th sec
        //console.log("TRYING TO DELETE BITCHES");
        cmd = `delete from activePlayers where TIMESTAMPDIFF(SECOND,lastSeen,NOW())>4`;
        mySqlFunction(cmd);
        i=1; //Resetting 
    }

    var diff = Date.now() - lastSuccessCount;
    if(count == 4 && diff > 10000 && lastSuccessJSON < 1000) {
        //Just adding some lag ok
        lastSuccessCount = Date.now();
        console.log(`diff:${diff}`);
        //Just to be on safe side
        console.log("Altering codmatch table");
        console.log(count);
        cmd = `delete from codmatch`;
        mySqlFunction(cmd);

        //Insert matched players to another table
        cmd = `INSERT INTO codmatch (username,userip) SELECT username,userip FROM activePlayers ORDER BY queueTime ASC LIMIT 4`;
        mySqlFunction(cmd);

        //Getting JSON 
        cmd = `select username,userip from activePlayers ORDER BY queueTime ASC LIMIT 4`;
        con.query(cmd, function (err, result) {
            if (err) throw err;
                var str = JSON.stringify(result);
                matchedKids = JSON.parse(str);
        });
        count = 0;
    }
}

function mySqlFunction(cmd){
    
    con.query(cmd, function (err, result) {
        if (err) throw err;
    });
    
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

app.get('/updateQueue',function(req,res){

    var uname = req.query.username;

    //console.log(uname);
    
    sql = `update activePlayers set lastSeen=NOW() where username='${uname}'`;    
    mySqlFunction(sql);

    //Return active count
    var i;
    var diff = Date.now() - lastSuccessJSON;
    if(count==4){
            //Check if I have been selected
        //console.log("I AM INSIDE");
        for(i=0;i<4;i++){
            if(matchedKids[i].username == uname && typeof matchedKids != 'undefined' && diff > 10000){
                res.json("-1");
                console.log(matchedKids[i].username);
                //TODO:
            }
        }
                
    }
    else 
        res.json(count);
})

app.get('/addMeToQueue',function(req,res){

    var uname = req.query.username;
    var ip = req.query.ip;
    //console.log(ip);
    //console.log(uname);
    res.json("You are added to queue");

    
    sql = `DELETE FROM activePlayers where username='${uname}'`; //Quick fix to avoid 1 crash
    mySqlFunction(sql);

    sql = `INSERT INTO activePlayers values('${uname}','${ip}',NOW(),NOW())`;    
    mySqlFunction(sql);
})


app.listen(1000, () => console.log(`Example app listening at http://localhost:1000`))
