/**
 * Play game 
 */
var angel = document.getElementById("angel");
var caption = document.getElementById("caption");
var chances = document.getElementById("chances"); 
var cp = document.getElementById("chances_p");
var guess = document.getElementById("guess");
var hint = document.getElementById("hint");
var alphabet_div = document.getElementById("alphabet");
var alphabet_arr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
                    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var answer = null;
var letters_cnt = 0;
var win = true;

//get answers from json file 
let xhr = new XMLHttpRequest(), url = "answers.json";
xhr.onreadystatechange = function(){
    if(xhr.readyState === 4 && xhr.status === 200){
        let arr = JSON.parse(xhr.responseText);
        getAnswer(arr);
    }
};
xhr.open("GET", url, true);
xhr.send();

function getAnswer(arr){
    var idx = Math.floor(Math.random() * arr.length);
    answer = arr[idx].answer;
    hint.innerHTML = "Hint: " + arr[idx].hint;
    setUp();
}//getAnswer

function setUp(){
    //set the spaces for the answer 
    for(let c = 0; c < answer.length; c++){
        var span = document.createElement("span");
       
        var letter = answer.charAt(c).toUpperCase();
        if(alphabet_arr.includes(letter)){
            span.setAttribute("class", letter); 
            span.innerHTML = "_";  
        } 
        else{
            span.setAttribute("class", "punct");
            span.innerHTML = answer.charAt(c);
        }
        span.classList.add("ans");
        guess.appendChild(span);
    }//for
    
    //set up the letters of the alphabet all are buttons
    //a b c d e f g h i j k l m n o p q r s t u v w x y z (26)
    for(let alph of alphabet_arr){
        var btn = document.createElement("button");
        btn.setAttribute("id", alph);
        btn.setAttribute("class", "letters");
        btn.innerHTML = alph;
        alphabet_div.appendChild(btn);
        
        //add click event
        btn.onclick = function(){ guessing(this) };
    }

    howFarAreWe(false);
}//setUp


function guessing(btn){
    var letter = btn.textContent;
    answer = answer.toUpperCase();
    if(answer.includes(letter)){
        //fill in the correct letters
        var letters = document.getElementsByClassName(letter).length;
        if(letters > 1){
            for(let s = 0; s < letters; s++){
                document.getElementsByClassName(letter)[s].innerHTML = letter;
            }
        }
        else{
            document.getElementsByClassName(letter)[0].innerHTML = letter;
        }
    }
    else{
        var num = parseInt(chances.innerHTML) - 1;
        chances.innerHTML = num.toString();
        if(num < 4){
            //show hint
            hint.style.visibility = "visible";
        }
        //show the answer when out of chances
        if(num == 0){
            win = false;
            var ans = answer.length;
            for(let a = 0; a < ans; a++){
                var ans_l = document.getElementsByClassName("ans")[a].innerHTML;
                if(ans_l == "_")
                    document.getElementsByClassName("ans")[a].innerHTML = answer.charAt(a).toUpperCase();
            }
        }
        
    }

    //disable button when done
    btn.disabled = true;
    btn.style.backgroundColor = "brown";
    btn.style.color = "black";
    
    howFarAreWe(true);

}//guessing

function howFarAreWe(buttonClicked){
    var count = 0;
    var spans = document.getElementsByTagName("span");
    for(sp of spans){
        if(sp.innerHTML == "_"){
            count += 1;
        }
    }
    if(buttonClicked){
        var shown = letters_cnt - count;
        var percentage = Math.round((shown / letters_cnt) * 100);
        //start showing the angel

        if(percentage >= 30 && percentage < 60){
            angel.style.visibility = "visible";
        }
        else if(percentage >= 60 && percentage < 100){
            angel.src = "images/angel_wings.png";
            angel.width = "200";
        }
        else if(percentage == 100){
            if(win){
                angel.src = "images/full_angel.png";
                caption.innerHTML = "Great job";
            }
            else{
                angel.src = "images/clapping_hands.png";
                caption.innerHTML = "It's okay, good effort"
            }
            angel.width = "300"

            //done waits three seconds 
            setTimeout(function(){
                var btn = document.createElement("button");
                btn.innerHTML = "Play another one";
                btn.style.borderRadius = "25px";
                cp.innerHTML = "";
                cp.appendChild(btn);
                btn.onclick = function(){ location.reload(); }
                cp.style.cursor = "pointer";
            }, 5000);
            
        }
        //console.log("Shown: " + shown + "  Percentage: " + percentage);
    }
    else{ //for the first time
        letters_cnt = count;
        //console.log("Letters: " + letters_cnt);
    }

}//howFarAreWe