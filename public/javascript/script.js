let userscore=0;
let compscore=0;
let msg=document.querySelector("#msg");
let userscores=document.querySelector("#userscore");
let compscores=document.querySelector("#compscore");

const getcompchoice=()=>{
    const opt=["rock","paper","scissor"];
    const randindex=Math.floor(Math.random()*3);
    return opt[randindex];
}

const choices=document.querySelectorAll(".choice");
const playgame=(userchoice)=>{
    console.log("userchoice->",userchoice);
    const compchoice=getcompchoice()
    console.log("compchoice->",compchoice);
    checkwinner(userchoice,compchoice);
    
}


choices.forEach((choice)=>{
console.log(choice)

    choice.addEventListener("click",()=>{

        const userchoice=choice.getAttribute("id");
console.log("Choice was clicked", userchoice);
playgame(userchoice);

    })
})



const checkwinner=(userchoice,compchoice)=>{
    let userwin=true;
    if(userchoice===compchoice){
        
        draw(userchoice,compchoice);
    }
   
    else if(userchoice==="paper"){
        userwin=compchoice==="rock" ? true : false; 
    }
    else if(userchoice==="scissor"){
        userwin=compchoice==="paper" ? true : false; 
    }
    else{
        userwin=compchoice==="paper" ? false :
        true;
    }

    showinner(userwin,userchoice,compchoice);
}

const showinner=(userwin,userchoice,compchoice)=>{

    if(userchoice===compchoice){
        draw(userchoice,compchoice);
    }
     else if(userwin){
        ++userscore;
        userscores.innerText=userscore;
        msg.innerText=`You Win: your ${userchoice} beats com ${compchoice}`;
    }
    else{
        ++compscore;
        compscores.innerText=compscore;
        msg.innerText=`Comp Win :com choose ${compchoice} beats your ${userchoice}`;
    }
}
const draw=(userchoice,compchoice)=>{
    
        userwin=false;
        console.log("match Draw");
        msg.innerText=`match draw: your choice ${userchoice} computer choice is ${compchoice}`;

    
}
