var ip;

function queue(){
    //console.log("Executing this queue function.")
    var tresult;
    var username = document.getElementById("username").value;
    console.log(ip);

    if(ip!='undefined'){
        $.ajax({url: `http://localhost:1000/addMeToQueue?username=${username}&ip=${ip}`, success: function(result){
        console.log(`${username} is added to the queue.`);
        }});
    }
    else{
        sleep(200);
        return queue();
    }

         
    var lp = setInterval(function() {
    //TODO: Add listener - Writer
        //Keep updating myself and get active player count
        $.ajax({url: `http://localhost:1000/updateQueue?username=${username}`, success: function(result){
            
            console.log(`updating...`);
            if(result=="-1"){
                alert("I AM SELECTED");
                tresult = result;
                $("#search-status").html(`You have a match!`);
            }    
            else{
                $("#search-status").html(`Players searching : ${result}`);

            }
        }});
        if(tresult=="-1"){
            clearInterval(lp);
        }
    }, 2000);
    console.log("OUT OF IT");
    
    return false;
}

function getIP(){

    $.getJSON("https://api.ipify.org?format=json", 
    function(data) {          
        ip = data.ip;
    }); 
    
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
