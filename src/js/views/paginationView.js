import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 and other pages
    if (curPage === 1 && numPages > 1)
      return this._generatePaginationBtn(curPage, 'next');

    // Other pages
    if (curPage < numPages && numPages > 1) {
      return `
      ${this._generatePaginationBtn(
        curPage,
        'prev'
      )} ${this._generatePaginationBtn(curPage, 'next')}
      `;
    }

    // Last page
    if (curPage === numPages && numPages > 1)
      return this._generatePaginationBtn(curPage, 'prev');

    if (curPage === numPages && numPages === 1)
      // Page 1 and NO other pages
      return ``;
  }

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generatePaginationBtn(page, btnType) {
    const markup =
      btnType === 'prev'
        ? `
    <button class="btn--inline pagination__btn--${btnType}" data-goto="${
            page - 1
          }">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${page - 1}</span>
    </button>
    `
        : `
    <button  class="btn--inline pagination__btn--${btnType}" data-goto="${
            page + 1
          }">
      <span>Page ${page + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;
    return markup;
  }
}

export default new PaginationView();
