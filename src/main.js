import { Serivces } from "./services/index.js";

const services = new Serivces();
const getEle = (id) => document.getElementById(id);

const getLstPhones = () => {
    services
        .getListPhonesApi()
        .then((result) => {
            // console.log(result.data);
            console.log(result.data[1])
            renderLstPhones(result.data);
        })
        .catch((error) => {
            console.log(error);
        })
};

getLstPhones();

const renderLstPhones = (data) => {
    var content = "";
    data.forEach((phone) => {
        content += `
        <div class="col-md-2">
                    <div class="card text-center">
                        <div class="card-img">
                           <img src="./img/${phone.img}" class="img-fluid" alt="">
                            <div class="card-cart d-flex">
                                <button type="submit" class="btn-card-detail" data-toggle="modal"
                                    data-target="#myModal${phone.name}">Reviews</button>
                                <button type="submit" class="btn-card-cart">Add to Cart</button>
                            </div>
                        </div>
                        <div class="card-body">
                            <h4 class="card-title mb-0">${phone.name}</h4>
                            <p class="card-text mb-0">$${phone.price}</p>
                            <p class="card-star mb-2">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </p>
                        </div>
                        <div class="modal fade" id="myModal${phone.name}">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h4 class="modal-title">${phone.name}</h4>
                                        <button type="button" class="close" data-dismiss="modal">×</button>
                                    </div>
                                    <div class="modal-body">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Price</th>
                                                    <th>Screen</th>
                                                    <th>Back Camera</th>
                                                    <th>Font Camera</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>$${phone.price}</td>
                                                    <td>${phone.screen}</td>
                                                    <td>${phone.backCamera}</td>
                                                    <td>${phone.frontCamera}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <p class="desc text-left">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet debitis
                                            molestias, neque veniam quibusdam atque totam aliquam alias modi quae ullam
                                            eligendi nesciunt, distinctio omnis delectus ad. Cupiditate, repellendus ab?
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        `;
    })
    getEle("phone_api_content").innerHTML = content;
}