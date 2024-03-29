"use strict";

//Make navbar transparent when it is on the top
const navbar = document.querySelector("#navbar");
const navbarHeight = navbar.getBoundingClientRect().height;
const toggleBar = document.querySelector(".navbar__toggle-btn");
document.addEventListener("scroll", () => {
  if (window.scrollY > navbarHeight) {
    navbar.classList.add("navbar--dark");
    toggleBar.classList.add("toggleBar");
  } else {
    navbar.classList.remove("navbar--dark");
    toggleBar.classList.remove("toggleBar");
  }

  navbarMenu.classList.remove("open");
});

// handle scrolling when tapping on the navbar menu
const navbarMenu = document.querySelector(".navbar__menu");
navbarMenu.addEventListener("click", (event) => {
  const target = event.target;
  const link = target.dataset.link;

  if (link == null) {
    return;
  }
  scrollIntoView(link);
});

// Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector(".navbar__toggle-btn");
navbarToggleBtn.addEventListener("click", () => {
  navbarMenu.classList.toggle("open");
});

/* handle click on "contact me " button on home */
const contactBtn = document.querySelector(".home__contact");
contactBtn.addEventListener("click", (event) => {
  scrollIntoView("#contact");
});

// Make home slowly fade to tranparent as the window scrolls down
const home = document.querySelector(".home__container");
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener("scroll", () => {
  home.style.opacity = 1 - window.scrollY / homeHeight;
});

// show "arrow up" button when scrolling down
const arrowUp = document.querySelector(".arrow-up");
document.addEventListener("scroll", () => {
  if (window.scrollY > homeHeight / 2) {
    arrowUp.classList.add("visible");
  } else {
    arrowUp.classList.remove("visible");
  }
});

//handle click on the arrow up btn

arrowUp.addEventListener("click", () => {
  scrollIntoView("#home");
});

// projects
const workBtnContainer = document.querySelector(".work__categories");
const projectContainer = document.querySelector(".work__projects");
const projects = document.querySelectorAll(".project");
workBtnContainer.addEventListener("click", (e) => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  if (filter == null) {
    return;
  }
  // Remove selection from the previous item and select the new one
  const active = document.querySelector(".category__btn.selected");
  active.classList.remove("selected");

  const target =
    e.target.nodeName === "BUTTON" ? e.target : e.target.parentNode;
  target.classList.add("selected");

  projectContainer.classList.add("anim-out");
  setTimeout(() => {
    projects.forEach((project) => {
      if (filter === "*" || filter === project.dataset.type) {
        project.classList.remove("invisible");
      } else {
        project.classList.add("invisible");
      }
    });
    projectContainer.classList.remove("anim-out");
  }, 300);
});



// 1. 모든 섹션 요소들과 메뉴아이템들을 가지고 온다
// 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다
const sectionIds = [
  "#home",
  "#about",
  "#skills",
  "#work",
  "#contact",
];
const sections = sectionIds.map((id) => document.querySelector(id));
const navItems = sectionIds.map((id) =>
  document.querySelector(`[data-link="${id}"]`)
);

let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
  selectedNavItem.classList.remove("active");
  selectedNavItem = selected;
  selectedNavItem.classList.add("active");
}

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.3,
};
function scrollIntoView(selector) {
    const scrollTo = document.querySelector(selector);
    scrollTo.scrollIntoView({ behavior: "smooth" });
    selectNavItem(navItems[sectionIds.indexOf(selector)])
  }
const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      // 스크롤링이 아래로 되어서 페이지가 올라옴
      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1;
      } else {
        selectedNavIndex = index - 1;
      }
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach((section) => observer.observe(section));

window.addEventListener("wheel", () => {
  if (window.scrollY === 0) {
    selectedNavIndex = 0;
  } else if (
    Math.round(window.scrollY + window.innerHeight) >=
    document.body.clientHeight
  ) {
    selectedNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectedNavIndex]);
});

const typeWriter = function (txtEl, words, wait = 2500) {
  this.txtEl = txtEl;
  this.words = words;
  //initirized  parameter.
  this.txt = "";
  this.wordIndex = 0;
  //which word are going on. array counter
  this.wait = parseInt(wait, 10);
  //same as parameter wait but it need to integer.
  this.type();
  //main arithmetic core.
  this.isDelet = false; //After typing anim we need to delet anim. it for that.
};
typeWriter.prototype.type = function () {
  // Current index of word = showing word from array
  const currentWord = this.wordIndex % this.words.length; // wordindex is 0 so if using % ans length

  // Get full of text length  current word.
  const fulltxt = this.words[currentWord]; // this line read word from array.

  // Check if you want to delet
  if (this.isDelet) {
    //delet function
    this.txt = fulltxt.substring(0, this.txt.length - 1);
  } else {
    //add text
    this.txt = fulltxt.substring(0, this.txt.length + 1);
  }
  // Insert txt into Elements
  this.txtEl.innerHTML = `<span class="text">${this.txt}</span>`;

  // initial type speed(change speed)
  let typeSpeed = 100;

  if (this.isDelet) {
    typeSpeed /= 2;
  }

  //if word is finished work.
  if (!this.isDelet && this.txt === fulltxt) {
    // making pause at end part
    typeSpeed = this.wait;
    // Set delete to true
    this.isDelet = true;
  } else if (this.isDelet && this.txt === "") {
    this.isDelet = false;
    // move to next word
    this.wordIndex++;
    //pause before start typing
    typeSpeed = 500;
  }

  setTimeout(() => this.type(), typeSpeed); //second parameter is millesecond = typing speed, main goal is each time we show up text
};

function init() {
  const txtEl = document.querySelector(".home__title");
  const words = JSON.parse(txtEl.getAttribute("data-words"));
  //data-wards is just string, so using JSON.parse, make them array
  const wait = txtEl.getAttribute("data-wait");
  // Init Typewiter(function init)
  new typeWriter(txtEl, words, wait);
}

document.addEventListener("DOMContentLoaded", init);
