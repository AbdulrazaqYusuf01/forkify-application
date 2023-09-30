import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime';
import { async } from 'regenerator-runtime';

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    // 0) update search result to mark selected search
    resultsView.update(model.getSearchResultsPage());

    // 1) updating bookmark view
    bookmarksView.update(model.state.bookmarks);

    if (!id) return;
    // 2) Loading recipe
    recipeView.renderSpinner();

    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();

    // 2) Await search result
    await model.loadSearchResults(query);

    // 3) Rendering search results
    resultsView.render(model.getSearchResultsPage());

    // 4) Rendering pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 3) Rendering NEW search results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Rendering NEW pagination
  paginationView.render(model.state.search);
};

const controlServings = function (updateTo) {
  // update servings in the state
  model.updateServings(updateTo);

  // update servings in the view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/Remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Rendering spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Rendering added recipe
    recipeView.render(model.state.recipe);

    // Render success message
    addRecipeView.renderMessage();

    // Rerendering the bookmark
    bookmarksView.render(model.state.bookmarks);

    // Changing the page's ID
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
      // addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🔥', err);
    addRecipeView.renderError(err.message);
  }
};

const addWelcome = function () {
  console.log('Welcome to the application!');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  addWelcome();
};
init();

// Object spreading trick
// const t = {
//   test: 'name of key',
// };

// console.log({ ...t });
