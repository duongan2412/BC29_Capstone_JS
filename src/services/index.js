export class Serivces {
    getListPhonesApi = () => axios
        ({
            url: "https://628b995c7886bbbb37bbca67.mockapi.io/api/phones",
            method: "GET"
        })
}
