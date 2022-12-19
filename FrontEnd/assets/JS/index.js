// main const declaration

const worksContainer = document.querySelector(".gallery");
const works = worksContainer.children;
const filtersSection = document.querySelector(".filters");
const logBtn = document.querySelector("#log");
const liveServerLink = "127.0.0.1:5500/BackEnd/";

// main var declaration

var i = 0;

// Usefull function for Fetch
// function to add work

function addWork(picture, title, id, idCat, catName) {
  const workTitle = title.replaceAll('"', "");
  const pictureLink = picture.replace("localhost:5678", liveServerLink);
  const workTemplate = `
  <figure id='${id}' data-categorie='${idCat}' data-categorie-name='${catName}' class='work show'>
    <img src='${pictureLink}' alt='${workTitle}' />
    <figcaption>${workTitle}</figcaption>
  </figure>
  `;
  worksContainer.insertAdjacentHTML("beforeend", workTemplate);
}

// function to get all categories then add filter buttons

function getAllCategories() {
  const portfolioElement = document.querySelectorAll("[data-categorie-name]");
  const allCategoriesNames = [];
  const allCategories = [];
  portfolioElement.forEach((e) => {
    if (!allCategoriesNames.includes(e.dataset.categorieName)) {
      allCategoriesNames.push(e.dataset.categorieName);
      allCategories.push(e.dataset.categorie);
    }
  });
  return [allCategories, allCategoriesNames];
}

function addFilterButtons() {
  const categories = getAllCategories();
  categories[1].forEach((e, i) => {
    const category = e.replace('"', "");
    const filterButtonTemplate = `
    <button 
    id="${category}" 
    class="filter" 
    data-categorie-id="${categories[0][i]}">
    ${category}
    </button>`;
    filtersSection.insertAdjacentHTML("beforeend", filterButtonTemplate);
  });
  return categories[0];
}

// function to toggle works displays

function toggleWorks() {
  this.parentNode.querySelector(".active").classList.remove("active");
  this.classList.add("active");
  if (!this.dataset.categorieId) {
    for (i = 0; i < works.length; i++) {
      works[i].classList.add("show");
    }
  } else {
    for (i = 0; i < works.length; i++) {
      works[i].classList.add("show");
      if (!(works[i].dataset.categorie === this.dataset.categorieId)) {
        works[i].classList.remove("show");
      }
    }
  }
}

async function init() {
  const token = window.getItem("token");

  const res = await fetch("http://localhost:5678/api/works");
  const data = await res.json();
  await data.forEach((e) => {
    addWork(e.imageUrl, e.title, e.id, e.category.id, e.category.name);
  });
  if (token) {
  } else {
    const categoriesId = addFilterButtons();
    const filtersButtons = document.getElementsByClassName("filter");
    console.log(filtersButtons);
    for (i; i < filtersButtons.length; i++) {
      filtersButtons[i].addEventListener("click", toggleWorks);
    }
  }
}

init();

// Fetch function
// fetch("http://localhost:5678/api/works")
//   .then(function (res) {
//     if (res.ok) {
//       // get data from API
//       return res.json();
//     }
//   })
//   .then(function (value) {
//     // use previous data and display work
//     const works = value;
//     works.forEach((e) => {
//       addWork(e.imageUrl, e.title, e.id, e.category.id, e.category.name);
//     });
//   })
//   .then(function (value) {
//     // use function to check all categories type and add button for it
//     const categoriesId = addFilterButtons();
//     const worksDOM = document.querySelectorAll(".work");
//     return [categoriesId, worksDOM];
//   })
//   .then(function (value) {
//     // add eventlistener to toggle display
//     const filtersType = value[0];
//     const filtersSection = value[1];

//     for (i; i < filtersSection.length; i++) {
//       filtersSection[i].addEventListener("click", toggleWorks);
//     }
//   })
//   .catch(function (err) {
//     // Une erreur est survenue
//     console.log("no data found" + err);
//   });
