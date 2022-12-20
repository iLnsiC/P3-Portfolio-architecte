// main const declaration
const worksContainer = document.querySelector(".gallery");
const works = worksContainer.children;
const filtersSection = document.querySelector(".filters");
const liveServerLink = "127.0.0.1:5500/BackEnd/";

// main const declaration after login
const logBtn = document.querySelector("#log");
const editBtnParents = [
  document.querySelector("#introduction_img"),
  document.querySelector("#introduction_article"),
  document.querySelector("#portfolio_title"),
];

// Usefull function in general

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
    for (var i = 0; i < works.length; i++) {
      works[i].classList.add("show");
      if (!(works[i].dataset.categorie === this.dataset.categorieId)) {
        works[i].classList.remove("show");
      }
    }
  }
}

// Usefull function after login

// add edit button
function addEditButtons(id, el) {
  const editBtnTemplate = `
    <button id='${id}' class="edit_btn">
      <i class="fas fa-regular fa-pen-to-square fa-lg"></i>
      modifier
    </button>
  `;
  if ((editBtnParents.indexOf(el) + 1) % 2 === 0) {
    el.insertAdjacentHTML("afterbegin", editBtnTemplate);
  } else {
    el.insertAdjacentHTML("beforeend", editBtnTemplate);
  }
}

// modals function
function openModal(title, figure, mainAction, deleteAction, previous, id) {
  const blackBgTemplate = '<div class="grey-bg"></div>';
  let closeModalButton;
  const modalTemplate = `
    <div class="modal">
      <div class="modal_wrapper">
        <button id="close_modal" class="modal_icon_option">
          <i class="fas fa-solid fa-xmark fa-2xl"></i>
        </button>
        ${previous}
        <h3 id="modal_title">${title}</h3>
        <div id="modal_body">
          ${figure}
        </div>
        <div id="modal_actions">
          <button class="green_btn">${mainAction}</button>
          <button class="delete_btn">${deleteAction}</button>
        </div>
      </div>
    </div>
  `;
  document.body.innerHTML = document.body.innerHTML + blackBgTemplate;
  const balckBg = document.querySelector(".grey-bg");

  switch (id) {
    case "edit_portfolio_title":
      document
        .querySelector("#portfolio")
        .insertAdjacentHTML("beforeend", modalTemplate);
      closeModalButton = document.querySelector("#close_modal");
      break;
    case "edit_introduction_article":
      closeModalButton = document.querySelector("#close_modal");

      break;
    case "edit_introduction_img":
      closeModalButton = document.querySelector("#close_modal");

      break;
  }
  closeModalButton.addEventListener("click", closeModal);
  balckBg.addEventListener("click", closeModal);
}

function setUpModal(data, element) {
  let figureTemplate = ``;
  const previousBtnTemplate = `
    <button id="previous_modal" class="modal_icon_option">
      <i class="fas fa-solid fa-arrow-left fa-2xl"></i>
    </button>
  `;
  const editTarget = element.id;
  switch (editTarget) {
    case "edit_portfolio_title":
      data.forEach((e) => {
        let workTitle = e.title.replaceAll('"', "");
        let pictureLink = e.imageUrl.replace("localhost:5678/", liveServerLink);
        figureTemplate =
          figureTemplate +
          `
          <div class='modal_picture'>
            <div class="modal_icon_wrapper">
              <button id="modal_icon_move_btn" class="modal_icon">
                <i class="fas fa-solid fa-up-down-left-right"></i>
              </button>
              <button id="modal_icon_delete_btn" class="modal_icon">
                <i class="fas fa-solid fa-trash-can"></i>
              </button>
            </div>
            <img src="${pictureLink}" alt="${workTitle}" />
            <button>éditer</button>
          </div>
        `;
      });
      openModal(
        "Galerie photo",
        figureTemplate,
        "Ajouter une photo",
        "Supprimer la galerie",
        "",
        "edit_portfolio_title"
      );
      break;
    case "edit_introduction_article":
      break;
    case "edit_introduction_img":
      break;
  }
}

function closeModal() {
  const balckBg = document.querySelector(".grey-bg");
  const modal = document.querySelector(".modal");
  modal.remove();
  balckBg.remove();
}

async function init() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5678/api/works");
  const data = await res.json();
  await data.forEach((e) => {
    addWork(e.imageUrl, e.title, e.id, e.category.id, e.category.name);
  });
  addFilterButtons();
  const filtersButtons = document.getElementsByClassName("filter");
  for (var i = 0; i < filtersButtons.length; i++) {
    filtersButtons[i].addEventListener("click", toggleWorks);
  }
  if (token) {
    for (var i = 0; i < editBtnParents.length; i++) {
      let id = "edit_";
      id = id + editBtnParents[i].id;
      addEditButtons(id, editBtnParents[i]);
    }
    const portfolioEditBtn = document.querySelector("#edit_portfolio_title");
    const introEditBtn = [
      document.querySelector("#edit_introduction_article"),
      document.querySelector("#edit_introduction_img"),
    ];
    portfolioEditBtn.addEventListener("click", function () {
      const element = this;
      setUpModal(data, element);
    });
  }
}

init();
