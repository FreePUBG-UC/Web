var firebaseConfig = {
    apiKey: "AIzaSyB8sPei_G1Ku7qB6FJBiRoXJ5AhN2Ry_rs",
    authDomain: "instantmessaging-3d78a.firebaseapp.com",
    databaseURL: "https://instantmessaging-3d78a.firebaseio.com",
    projectId: "instantmessaging-3d78a",
    storageBucket: "instantmessaging-3d78a.appspot.com",
    messagingSenderId: "78704653938",
    appId: "1:78704653938:web:a8a4f49c5482fe6905f4eb",
    measurementId: "G-ZT878F49KK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

userName = localStorage.getItem("nUserName");
name = localStorage.getItem("nName");

function checkUser(){

    if(userName==null || name==null){
        window.location.href = "index.html";
        alert("Please login again!");
    }
}

function getTimeDate(){
    var today = new Date();
    var date = +today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = time+'   on  '+date;

    return dateTime;
};

function tweetIt(){
    var getTweet = document.getElementById("tweet").value;
    var getTD = getTimeDate();
    //Save in database
    firebase.database().ref("tweets").push().set({
        "tweet": getTweet,
        "name": name,
        "time": getTD
    });
    
    document.getElementById('tweet').value = "";

    //Prevent form from submitting
    return false;
}

function loginUser(){
    var userName = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    
    //On success open home page.
    var ref = firebase.database().ref("users");
    ref.once("value").then(function(snapshot) {
        var firebasePassword = snapshot.child(`${userName}/password`).val();
        var firebaseName = snapshot.child(`${userName}/name`).val();
        if(firebasePassword==password){
            localStorage.setItem("nUserName",userName);
            localStorage.setItem("nName",firebaseName);
            window.location.href = "home.html";
        } else{
            alert("Login failed!");
        }
    });
    
    return false;
}

function addUser(){
    var name = document.getElementById("name").value;
    var userName = document.getElementById("userName").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if(userName.trim() == "" || name.trim() == "")
    {
        alert("You might have left Username or Name empty!");
    }
    else{
        firebase.database().ref(`users/${userName}`).set({
            "name":name,
            "password":password,
             "email":email
        });
        
        localStorage.setItem("nUserName",userName);
        localStorage.setItem("nName",name); 
                  
        window.location.href = "home.html";
    }
    
}	
