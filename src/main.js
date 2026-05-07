import getImagesByQuery from "./js/pixabay-api";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { 
    createGallery, 
    clearGallery, 
    showLoader, 
    hideLoader, 
    showLoadMoreButton, 
    hideLoadMoreButton 
} from "./js/render-functions";

const formE1 = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more-btn");

let page = 1;
let currentQuery = "";


formE1.addEventListener("submit", handleSubmit); 
loadMoreBtn.addEventListener("click", handleLoadMore);

async function handleSubmit(event) {
    event.preventDefault();

    const searchQuery = event.currentTarget.elements["search-text"].value.trim();
    
    if (!searchQuery) {
        iziToast.warning({ message: "Please enter a search query" });
        return;
    }

    currentQuery = searchQuery;
    page = 1;
    clearGallery();
    hideLoadMoreButton(); 
    showLoader();
    
    try {
        const { hits, totalHits } = await getImagesByQuery(searchQuery, page);
        
        if (hits.length > 0) {
            createGallery(hits);
            checkEndOfCollection(page, totalHits);
        } else {
            iziToast.show({
                color: '#EF4040',
                messageColor: '#FAFAFB',
                message: 'Sorry, there are no images matching your search query. Please try again!',
                maxWidth: '322px'
            });
        }
    } catch(error) {
        iziToast.error({ message: error.message });
    } finally {
        event.target.reset();
        hideLoader();
    }
}

async function handleLoadMore() {
    page += 1;
    showLoader();
    hideLoadMoreButton();

    try {
        const { hits, totalHits } = await getImagesByQuery(currentQuery, page);
        createGallery(hits);
        const galleryItem = document.querySelector(".gallery-item");
        if (galleryItem) {
            const cardHeight = galleryItem.getBoundingClientRect().height;
            window.scrollBy({
                top: cardHeight * 2,
                behavior: "smooth",
            });
        }

        checkEndOfCollection(page, totalHits);
    } catch(error) {
        iziToast.error({ message: error.message });
    } finally {
        hideLoader();
    }
}

function checkEndOfCollection(page, totalHits) {
    const perPage = 15;
    if (page * perPage >= totalHits) {
        hideLoadMoreButton();
        iziToast.info({
            message: "We're sorry, but you've reached the end of search results.",
        });
    } else {
        showLoadMoreButton();
    }
}