// main const declaration

const worksContainer = document.querySelector(".gallery");
const filtersButtons = document.querySelector(".filters");
const work = worksContainer;
const liveServerLink = "127.0.0.1:5500/BackEnd/";

// main var declaration

var i = 0;

// Usefull function for Fetch
// function to add work

function addWork(picture, title, id, idCat, catName) {
  const workTitle = title.replaceAll('"', "");
  const pictureLink = picture.replace("localhost:5678", liveServerLink);
  const workTemplate = `
  <figure id='${id}' data-categorie='${idCat}' data-categorie-name='${catName}' class='work'>
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
  console.log(categories);
  categories[1].forEach((e, i) => {
    const category = e.replace('"', "");
    const filterButtonTemplate = `
    <button 
    id="${category}" 
    class="filter" 
    data-categorie-id="${categories[0][i]}">
    ${category}
    </button>`;
    filtersButtons.insertAdjacentHTML("beforeend", filterButtonTemplate);
  });
  return categories[0];
}

// functio to toggle works displays

function toggleWorks() {
  const elementToShow = this.id;
  for (i = 0; i < filtersButtons.length; i++) {
    if (filtersButtons[i] === elementToShow) {
    }
  }
}

// Fetch function
fetch("http://localhost:5678/api/works")
  .then(function (res) {
    if (res.ok) {
      // get data from API
      return res.json();
    }
  })
  .then(function (value) {
    // use previous data and display work
    const works = value;
    works.forEach((e) => {
      addWork(e.imageUrl, e.title, e.id, e.category.id, e.category.name);
    });
  })
  .then(function (value) {
    // use function to check all categories type and add button for it
    const categoriesId = addFilterButtons();
    const worksDOM = document.querySelectorAll(".work");
    return [categoriesId, worksDOM];
  })
  .then(function (value) {
    // add eventlistener to toggle display
    const filtersType = value[0];
    const filtersButtons = value[1];

    for (i; i < filtersButtons.length; i++) {
      filtersButtons[i].addEventListener("click", toggleWorks);
    }
  })
  .catch(function (err) {
    // Une erreur est survenue
    console.log("no data found" + err);
  });