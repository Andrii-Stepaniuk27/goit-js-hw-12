import axios from "axios";

const API_KEY = "55699882-78e76ba09440d2b00f4853bc0";

export default async function getImagesByQuery(query, page) {
    const { data } = await axios.get("https://pixabay.com/api/", {
        params: {
            key: API_KEY,
            q: query,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            page: `${page}`,
            per_page: 15
        }
    }); 
    return data;
};
