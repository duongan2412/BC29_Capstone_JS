class Serivces {
    getListPhonesApi = () => axios
        ({
            url: "https://628b995c7886bbbb37bbca67.mockapi.io/api/phones",
            method: "GET"
        });

    getPhoneByIdApi = (id) => axios
        ({
            url: `https://628b995c7886bbbb37bbca67.mockapi.io/api/phones/${id}`,
            method: "GET"
        });

}
