const services = new Serivces();
const lstPhone = new LstPhones();
const lstCart = new ListCart();
const arrPhone = lstPhone.phoneList;

const getEle = (id) => document.getElementById(id);

// funct lấy thông tin từ api
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

// render thông tin api qua html
const renderLstPhones = (data) => {
    var content = "";
    data.forEach((phone) => {
        content += `
        <div class="col-md-2 cart_item">
                    <div class="card text-center">
                        <div class="card-img">
                            <img src="./img/${phone.img}" class="img-fluid phoneImg" alt="${phone.img}">
                            <span class="phoneId">${phone.id}</span>
                            <div class="card-cart d-flex">
                                <button type="button" class="btn-card-detail" data-toggle="modal"
                                    data-target="#myModal" onclick="reviewPhone('${phone.id}')">Reviews</button>
                                <button type="button" class="btn-card-cart" onclick="addToCart(event)" data-action="${phone.id}">Add to Cart</button>
                                <div class="qty_content inactive">
                                    <span class="qty_minus" onclick="decreaseItem(event)">-</span>
                                    <span class="qty"></span>
                                    <span class="qty_plus" onclick="increaseItem(event)">+</span>
                                </div>

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

// hiện thị khi chọn loại phone
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

// lấy thông tin để show lên modal reivews
const getPhoneReviews = (id) => {
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
    getPhoneReviews(id);
}

// add item vào list cart
addToCart = (event) => {
    const ele = event.target.parentElement;
    ele.querySelector(".btn-card-cart").classList.add("inactive");
    ele.querySelector(".qty_content").classList.remove("inactive");
    const cartItemDom = event.target.parentElement.parentElement.parentElement;
    const cartItemId = event.target.getAttribute("data-action");
    const cartItemImg = cartItemDom.querySelector(".phoneImg").getAttribute("alt");
    const cartItemName = cartItemDom.querySelector(".phoneName").innerHTML;
    const cartItemPrice = cartItemDom.querySelector(".phonePrice").innerHTML;
    let cartItemQty = 1;
    const cartItem = new CartItem(cartItemId, cartItemName, cartItemPrice, cartItemImg, cartItemQty);
    let cartItemLst = localStorage.getItem("ListCart");
    cartItemLst = JSON.parse(cartItemLst);
    if (cartItemLst != null) {
        if (cartItemLst[cartItem.name] == undefined) {
            cartItemLst = {
                ...cartItemLst,
                [cartItem.name]: cartItem
            }
        } else {
            cartItemLst[cartItem.name].qty += 1;
        }
    } else {
        cartItemLst = {
            [cartItem.name]: cartItem
        }
    }
    cartItemDom.querySelector(".qty").innerHTML = cartItemLst[cartItem.name].qty;
    localStorage.setItem("ListCart", JSON.stringify(cartItemLst));
    inCart = Object.values(cartItemLst)
    console.log(inCart);
    let total = 0;
    for (let i = 0; i < inCart.length; i++) {
        total += inCart[i].qty;
    }
    console.log(total);
    if (total > 0) {
        getEle("cartTotalQty").classList.remove("inactive");
        getEle("cartTotalQty").innerHTML = total
    } else {
        getEle("cartTotalQty").classList.add("inactive");
    }
}

// tăng số lượng
increaseItem = (event) => {
    const cartItemDom = event.target.parentElement.parentElement.parentElement.parentElement;
    const cartItemName = cartItemDom.querySelector(".phoneName").innerHTML;
    const btnAdd = cartItemDom.querySelector(".btn-card-cart");
    const divQty = cartItemDom.querySelector(".qty_content");
    let cartItemLst = localStorage.getItem("ListCart");
    cartItemLst = JSON.parse(cartItemLst);
    if (cartItemLst[cartItemName] != undefined) {
        cartItemLst[cartItemName].qty += 1;
        cartItemDom.querySelector(".qty").innerHTML = cartItemLst[cartItemName].qty;
        if (cartItemLst[cartItemName].qty > 0) {
            divQty.classList.remove("inactive");
            btnAdd.classList.add("inactive");
        }
    }
    localStorage.setItem("ListCart", JSON.stringify(cartItemLst));

    inCart = Object.values(cartItemLst)
    let total = 0;
    for (let i = 0; i < inCart.length; i++) {
        total += inCart[i].qty;
    }
    // console.log(total);
    if (total > 0) {
        getEle("cartTotalQty").classList.remove("inactive");
        getEle("cartTotalQty").innerHTML = total
    } else {
        getEle("cartTotalQty").classList.add("inactive");
    }
}

// giảm số lượng
decreaseItem = (event) => {
    const cartItemDom = event.target.parentElement.parentElement.parentElement.parentElement;
    const cartItemName = cartItemDom.querySelector(".phoneName").innerHTML;
    const btnAdd = cartItemDom.querySelector(".btn-card-cart");
    const divQty = cartItemDom.querySelector(".qty_content");
    let cartItemLst = localStorage.getItem("ListCart");
    cartItemLst = JSON.parse(cartItemLst);
    if (cartItemLst[cartItemName] != undefined) {
        cartItemLst[cartItemName].qty -= 1;
        cartItemDom.querySelector(".qty").innerHTML = cartItemLst[cartItemName].qty;
        if (cartItemLst[cartItemName].qty == 0) {
            btnAdd.classList.remove("inactive");
            divQty.classList.add("inactive");
        }
    }

    localStorage.setItem("ListCart", JSON.stringify(cartItemLst));

    inCart = Object.values(cartItemLst)
    let total = 0;
    for (let i = 0; i < inCart.length; i++) {
        total += inCart[i].qty;
    }
    // console.log(total);
    if (total > 0) {
        getEle("cartTotalQty").classList.remove("inactive");
        getEle("cartTotalQty").innerHTML = total
    } else {
        getEle("cartTotalQty").classList.add("inactive");
    }

}

// // hiện thị số lượng ở giỏ hàng
// const showCartNum = () => {
//     let total = 0
//     let cartItemLst = localStorage.getItem("ListCart");
//     cartItemLst = JSON.parse(cartItemLst);
//     cartItemLst = Object.values(cartItemLst)
//     // console.log(cartItemLst);
//     for (let i = 0; i < cartItemLst.length; i++) {
//         total += cartItemLst[i].qty;
//     }
//     if (total > 0) {
//         getEle("cartTotalQty").classList.remove("inactive");
//         getEle("cartTotalQty").textContent = total
//     } else {
//         getEle("cartTotalQty").classList.add("inactive");
//     }
// }

// showCartNum();