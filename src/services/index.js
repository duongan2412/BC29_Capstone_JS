class Serivces {
    getProductList = () => axios
        ({
            url: "https://628b995c7886bbbb37bbca67.mockapi.io/api/phones",
            method: "GET"
        });

    getProductApi = (id) => axios
        ({
            url: `https://628b995c7886bbbb37bbca67.mockapi.io/api/phones/${id}`,
            method: "GET"
        });

}
