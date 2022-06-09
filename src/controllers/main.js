const services = new Serivces();
const lstPhone = new LstPhones();
const lstCart = new ListCart();
const arrPhone = lstPhone.phoneList;

const getEle = (id) => document.getElementById(id);

// funct lấy arr api
const getArrPhone = (data) => {
    data.forEach((ele) => {
        const id = ele.id;
        const name = ele.name;
        const price = ele.price;
        const screen = ele.screen;
        const backCamera = ele.backCamera;
        const frontCamera = ele.frontCamera;
        const img = ele.img;
        const desc = ele.desc;
        const type = ele.type;
        const phone = new Phone(id, name, price, screen, backCamera, frontCamera, img, desc, type);
        lstPhone.addPhone(phone);
    })
}

const getLstPhonesApi = () => {
    services
        .getListPhonesApi()
        .then((result) => {
            // console.log(result.data);
            getArrPhone(result.data);
            renderLstPhones(result.data)
        })
        .catch((error) => {
            console.log(error);
        })
};

getLstPhonesApi();

// render api > html
const renderLstPhones = (data) => {
    var content = "";
    data.forEach((phone) => {
        content += `
        <div class="col-md-2">
                    <div class="card text-center">
                        <div class="card-img">
                            <img src="./img/${phone.img}" class="img-fluid phoneImg" alt="${phone.img}">
                            <span class="phoneId">${phone.id}</span>
                            <div class="card-cart d-flex">
                                <button type="button" class="btn-card-detail" data-toggle="modal"
                                    data-target="#myModal" onclick="reviewPhone('${phone.id}')">Reviews</button>
                                <button type="button" class="btn-card-cart" onclick="addToCart(this)" data-action="add-to-cart">Add to Cart</button>
                            </div>
                        </div>
                        <div class="card-body">
                            <h4 class="card-title mb-0 phoneName">${phone.name}</h4>
                            <p class="card-text mb-0 phonePrice">$${phone.price}</p>
                            <p class="card-star mb-2">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </p>
                        </div>
                    </div>
                </div>
        `;
    })
    getEle("phone_api_content").innerHTML = content;
}

// select box chọn phone type
typePhone = () => {
    const typeSelect = getEle("typeSelect").value;
    const fillerPhone = arrPhone.filter((phone) => {
        if (phone.type !== typeSelect) {
            return false;
        }
        return true;
    })
    if (fillerPhone.length == 0) {
        renderLstPhones(arrPhone);
    } else {
        renderLstPhones(fillerPhone);
    }
}

// dom element qua model btn reviews
const getPhoneInfo = (id) => {
    services
        .getPhoneByIdApi(id)
        .then((result) => {
            getEle("phoneNameModals").innerHTML = result.data.name;
            getEle("phonePriceModals").innerHTML = result.data.price;
            getEle("phoneScreenModals").innerHTML = result.data.screen;
            getEle("phoneBackModals").innerHTML = result.data.backCamera;
            getEle("phoneFontModals").innerHTML = result.data.frontCamera;
            getEle("phoneDescModals").innerHTML = result.data.desc;
        })
        .catch((error) => {
            console.log(error);
        })
}

reviewPhone = (id) => {
    getPhoneInfo(id);
}

// add cart 
addToCart = (ele) => {
    const arrBtnAdd = document.querySelectorAll(".btn-card-cart");
    for (let i = 0; i < arrBtnAdd.length; i++) {
        ele.disabled = true;
        ele.innerHTML = "In cart";
        ele.style.color = "red";
    };
    // console.log(arrBtnAdd);
    // arrBtnAdd.forEach(arrBtnAdd => {
    //     arrBtnAdd.addEventListener("click", () => {
    //         const productDom = arrBtnAdd.parentNode.parentNode;
    //         console.log(productDom);
    //         // const itemID = productDom.querySelector(".phoneID").value;
    //         // console.log(itemID);
    //     })
    // })
    arrBtnAdd.forEach(arrBtnAdd => {
        const productDom = arrBtnAdd.parentNode.parentNode.parentNode;
        console.log(productDom);
        const cartItemID = productDom.querySelector(".phoneId").innerHTML;
        const cartItemImg = productDom.querySelector(".phoneImg").getAttribute("alt");
        const cartItemName = productDom.querySelector(".phoneName").innerHTML;
        const cartItemPrice = productDom.querySelector(".phonePrice").innerHTML;
        console.log(cartItemID, cartItemImg, cartItemName, cartItemPrice);
    })
}

// lấy sản phẩm từ api qua id
// function getPhoneInfo(id) {
//     service
//     .getProductById(id);
//     .then(function (result) {
//             getEle("TenSP").value = result.data.tenSP;
//             getEle("GiaSP").value = result.data.gia;
//             getEle("HinhSP").value = result.data.hinhAnh;
//             getEle("moTa").value = result.data.moTa;
//         })
//     .catch(function (error) {
//             console.log(error);
//         });
// }


