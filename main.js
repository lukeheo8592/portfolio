'use strict';


//Make navbar transparent when it is on the top
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', () =>{
    if(window.scrollY > navbarHeight){
        navbar.classList.add('navbar--dark');
    }else{
        navbar.classList.remove('navbar--dark');
    }
});

// handle scrolling when tapping on the navbar menu
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', (event)=>{
    
    const target = event.target;
    const link = target.dataset.link;

    if(link == null){
        return;
    }
    scrollIntoView(link);
})


 /* handle click on "contact me " button on home */
const contactBtn = document.querySelector('.home__contact');
contactBtn.addEventListener('click', (event)=>{

    scrollIntoView('#contact');
})


// Make home slowly fade to tranparent as the window scrolls down
const home = document.querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', ()=> {

    home.style.opacity = 1 - window.scrollY / homeHeight;
    console.log("Asdasd" + home);
})


// show "arrow up" button when scrolling down
const arrowUp = document.querySelector('.arrow-up')
document.addEventListener('scroll', ()=>{
    if(window.scrollY > homeHeight /2){
        arrowUp.classList.add('visible');
    } else{
        arrowUp.classList.remove('visible');
    }
})

//handle click on the arrow up btn

arrowUp.addEventListener('click', ()=> {
    scrollIntoView('#home')
})

// projects
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project');
workBtnContainer.addEventListener('click', (e) => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  if (filter == null) {
    return;
  }
 // Remove selection from the previous item and select the new one
 const active = document.querySelector('.category__btn.selected');
 if (active != null) {
   active.classList.remove('selected');
 }
 e.target.classList.add('selected');

 projectContainer.classList.add('anim-out');
 setTimeout(() => {
   projects.forEach((project) => {
     if (filter === '*' || filter === project.dataset.type) {
       project.classList.remove('invisible');
     } else {
       project.classList.add('invisible');
     }
   });
   projectContainer.classList.remove('anim-out');
 }, 300);
});

function scrollIntoView(selector){
    const scrollTo = document.querySelector(selector);
    scrollTo.scrollIntoView({behavior: "smooth"});
}




const typeWriter = function(txtEl, words, wait=2500) {
    this.txtEl =txtEl;
    this.words=words;
    //initirized  parameter.
    this.txt = '';
    this.wordIndex = 0;
    //which word are going on. array counter
    this.wait = parseInt(wait, 10);
    //same as parameter wait but it need to integer.
    this.type();
    //main arithmetic core.
    this.isDelet = false;  //After typing anim we need to delet anim. it for that.

}
typeWriter.prototype.type = function(){
    // Current index of word = showing word from array
    const currentWord = this.wordIndex % this.words.length;   // wordindex is 0 so if using % ans length

    // Get full of text length  current word.
    const fulltxt = this.words[currentWord]; // this line read word from array.

    // Check if you want to delet
    if(this.isDelet){
        //delet function
        this.txt =fulltxt.substring(0, this.txt.length -1);
    } else {
        //add text
        this.txt =fulltxt.substring(0, this.txt.length +1); 
    }
    // Insert txt into Elements
    this.txtEl.innerHTML=`<span class="text">${this.txt}</span>`;

    // initial type speed(change speed)
    let typeSpeed = 100;

    if(this.isDelet){
        typeSpeed /= 2;
    }



    //if word is finished work.
    if(!this.isDelet && this.txt === fulltxt){
        // making pause at end part
        typeSpeed = this.wait;
        // Set delete to true
        this.isDelet = true;

    } else if(this.isDelet && this.txt === '') {
        this.isDelet = false;
        // move to next word
        this.wordIndex++;
        //pause before start typing
        typeSpeed = 500;

    }

    setTimeout(() => this.type(), typeSpeed)    //second parameter is millesecond = typing speed, main goal is each time we show up text
}


function init(){
    const txtEl = document.querySelector('.home__title');
    const words = JSON.parse(txtEl.getAttribute('data-words'));
    //data-wards is just string, so using JSON.parse, make them array
    const wait = txtEl.getAttribute('data-wait');
    // Init Typewiter(function init)
    new typeWriter(txtEl, words, wait);
}

document.addEventListener('DOMContentLoaded', init);
