import axios from "axios";

export const BASE_URL = "https://localhost:7261/";

export const EndPoints = {
    Security: "security",
};

export const createAPIEndpoint = (endpoint) => {
    let url = BASE_URL + "api/" + endpoint + "/";
    return {
        getPrimaryKey: () => axios.get(url + "primarykey"),
        getSecondaryKey: () => axios.get(url + "secondarykey"),
        postCard: (data) => axios.post(url, data),
    };
};
