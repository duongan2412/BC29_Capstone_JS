const services = new Serivces();
const productList = new ProductList();
const cartList = new CartList();
const getEle = (id) => document.getElementById(id);
let arrCartList = cartList.arrCartList;

// lấy thông tin api về
const getProductLstApi = () => {
    services
        .getProductList()
        .then((result) => {
            tempProductList(result.data);
            renderProdocList(result.data)
        })
        .catch((error) => {
            console.log(error);
        })
}

getProductLstApi();

const tempProductList = (data) => {
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
        const phone = new Product(id, name, price, screen, backCamera, frontCamera, img, desc, type);
        productList.addProduct(phone);
    })
}

// render thông tin api qua html
const renderProdocList = (data) => {
    let content = "";
    data.forEach((product) => {
        content += `
        <div class="col-md-2 cart_item">
                    <div class="card text-center">
                        <div class="card-img">
                            <img src="./img/${product.img}" class="img-fluid phoneImg" alt="${product.img}">
                            <span class="phoneId">${product.id}</span>
                            <div class="card-cart d-flex">
                                <button type="button" class="btn-card-detail" data-toggle="modal"
                                    data-target="#myModal" onclick="reviewProduct(${product.id})">Reviews</button>
                                <button type="button" class="btn-card-cart" onclick="addToCart(event)" data-action="${product.id}">Add to Cart</button>
                                <div class="qty_content inactive">
                                    <span class="qty_minus" onclick="decreaseItem(event)">-</span>
                                    <span class="qty"></span>
                                    <span class="qty_plus" onclick="increaseItem(event)">+</span>
                                </div>

                            </div>
                        </div>
                        <div class="card-body">
                            <h4 class="card-title mb-0 phoneName">${product.name}</h4>
                            <p class="card-text mb-0">$<span class = "phonePrice">${product.price}</span></p>
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
    const typeSelected = getEle("selectedType").value;
    const filerPhone = productList.arrProductList.filter((product) => {
        if (product.type !== typeSelected) {
            return false;
        }
        return true;
    })
    if (filerPhone.length == 0) {
        renderProdocList(productList.arrProductList);
    } else {
        renderProdocList(filerPhone);
    }
}

// hiện thị thông tin product lên modals review
const getProductApiById = (id) => {
    services
        .getProductApi(id)
        .then((result) => {
            getEle("phoneNameModals").innerHTML = result.data.name;
            getEle("phonePriceModals").innerHTML = '$' + result.data.price;
            getEle("phoneScreenModals").innerHTML = result.data.screen;
            getEle("phoneBackModals").innerHTML = result.data.backCamera;
            getEle("phoneFontModals").innerHTML = result.data.frontCamera;
            getEle("phoneDescModals").innerHTML = result.data.desc;
        })
        .catch((error) => {
            console.log(error);
        })
}

reviewProduct = (id) => {
    getProductApiById(id);
}

// xử lý add product vào cart
const getLocalStorage = () => {
    let cartItemList = localStorage.getItem("CART_LIST");
    cartItemList = JSON.parse(cartItemList);
    return cartItemList;
}

const setItemLocalStorage = (cartItemList) => {
    localStorage.setItem("CART_LIST", JSON.stringify(cartItemList));
    inCart = Object.values(cartItemList)
    let total = 0;
    for (let i = 0; i < inCart.length; i++) {
        total += inCart[i].qty;
    }
    if (total > 0) {
        getEle("cartTotalQty").classList.remove("inactive");
        getEle("cartTotalQty").innerHTML = total
    } else {
        getEle("cartTotalQty").classList.add("inactive");
    }
}

addToCart = (event) => {
    const ele = event.target.parentElement;
    ele.querySelector(".btn-card-cart").classList.add("inactive");
    ele.querySelector(".qty_content").classList.remove("inactive");
    // const cartItemDom = event.target.parentElement.parentElement.parentElement.parentElement;
    const cartItemDom = event.target.closest(".cart_item");
    const cartItemId = event.target.getAttribute("data-action");
    const cartItemImg = cartItemDom.querySelector(".phoneImg").getAttribute("alt");
    const cartItemName = cartItemDom.querySelector(".phoneName").innerHTML;
    const cartItemPrice = cartItemDom.querySelector(".phonePrice").innerHTML;
    const cartItemQty = 1;
    const cartItem = new CartItem(cartItemId, cartItemName, cartItemPrice, cartItemImg, cartItemQty);
    let cartItemList = getLocalStorage();
    if (cartItemList != null) {
        if (cartItemList[cartItem.name] == undefined) {
            cartItemList = {
                ...cartItemList,
                [cartItem.name]: cartItem
            }
        } else {
            cartItemList[cartItem.name].qty += 1;
        }
    } else {
        cartItemList = {
            [cartItem.name]: cartItem
        }
    }
    cartItemDom.querySelector(".qty").innerHTML = cartItemList[cartItem.name].qty;
    // console.log(typeof cartItemList);
    setItemLocalStorage(cartItemList);
    renderCartList();
}

// tăng số lượng
increaseItem = (event) => {
    // const cartItemDom = event.target.parentElement.parentElement.parentElement.parentElement;
    const cartItemDom = event.target.closest(".cart_item");
    const cartItemName = cartItemDom.querySelector(".phoneName").innerHTML;
    const btnAdd = cartItemDom.querySelector(".btn-card-cart");
    const divQty = cartItemDom.querySelector(".qty_content");
    let cartItemList = getLocalStorage();
    if (cartItemList[cartItemName] != undefined) {
        cartItemList[cartItemName].qty += 1;
        cartItemDom.querySelector(".qty").innerHTML = cartItemList[cartItemName].qty;
        if (cartItemList[cartItemName].qty > 0) {
            divQty.classList.remove("inactive");
            btnAdd.classList.add("inactive");
        }
    }
    setItemLocalStorage(cartItemList);
}

// giảm số lượng
decreaseItem = (event) => {
    // const cartItemDom = event.target.parentElement.parentElement.parentElement.parentElement;
    const cartItemDom = event.target.closest(".cart_item");
    const cartItemName = cartItemDom.querySelector(".phoneName").innerHTML;
    const btnAdd = cartItemDom.querySelector(".btn-card-cart");
    const divQty = cartItemDom.querySelector(".qty_content");
    let cartItemList = getLocalStorage();
    if (cartItemList[cartItemName] != undefined) {
        cartItemList[cartItemName].qty -= 1;
        cartItemDom.querySelector(".qty").innerHTML = cartItemList[cartItemName].qty;
        if (cartItemList[cartItemName].qty == 0) {
            btnAdd.classList.remove("inactive");
            divQty.classList.add("inactive");
        }
    }
    setItemLocalStorage(cartItemList);
}

// render item in cart
const renderCartList = () => {
    const arrInCart = convertObjToArr("CART_LIST");
    if (arrInCart == undefined) {
        return;
    }
    let contentHTML = "";
    let paysum = 0;
    arrInCart.forEach((ele) => {
        const price = parseInt(ele.price);
        const qty = parseInt(ele.qty);
        const pricesum = price * qty;
        paysum += pricesum;
        contentHTML += `
    <tr>
        <td class="w-25">
            <img src="./img/${ele.img}" class="img-fluid img-thumbnail">
        </td>
        <td class="phoneName">${ele.name}</td>
        <td>$${price}</td>
        <td class="qty"><input class="phoneQty" type="number" class="form-control" min=0 value="${qty}" onchange="checkQty(event)"></td>
        <td>$${pricesum}</td>
        <td>
            <a href="#" class="btn btn-danger btn-sm" onclick="removeItem('${ele.id}')">
                <i class="fa fa-times"></i>
            </a>
        </td>
    </tr>
    `
    });
    paysum = '$' + paysum;
    getEle("paysum").innerHTML = paysum;
    getEle("tbodyInCart").innerHTML = contentHTML;
}

getEle("showCart").addEventListener("click", () => {
    renderCartList();
})

// Chuyển obj storage sang arr
const convertObjToArr = (obj) => {
    let arrInCart = [];
    let cartItemList = localStorage.getItem(obj);
    if (cartItemList == undefined) {
        return;
    }
    cartItemList = JSON.parse(cartItemList);
    inCart = Object.values(cartItemList)
    inCart.forEach(currentItem => {
        if (currentItem.qty > 0) {
            arrInCart.push(currentItem)
        }
    });
    return arrInCart;
}

// chuyển arr CartList sang obj storage
const convertArrToObj = (arr) => {
    return arr.length == 0 ? null : result = Object.assign.apply(null, arr.map(ele => ({ [ele.name]: ele })));
}

const syncObjtpArr = () => {
    const arrInCart = convertObjToArr("CART_LIST");
    cartList.arrCartList = arrInCart
}

syncObjtpArr();

removeItem = (id) => {
    const arrInCart = convertObjToArr("CART_LIST");
    cartList.arrCartList = arrInCart;
    cartList.deleteItem(id);
    const result = convertArrToObj(cartList.arrCartList);
    if (result == null) {
        localStorage.removeItem("CART_LIST");
        getEle("closeCartList").click();
    } else {
        setItemLocalStorage(result);
        renderCartList();
    }
}

checkQty = (event) => {
    const tr = event.target.parentElement.parentElement;
    // const tr = event.target.closest(".cart_item");
    const cartItemName = tr.querySelector(".phoneName").innerHTML;
    const cartItemQty = tr.querySelector(".phoneQty").value * 1;
    const arrInCart = convertObjToArr("CART_LIST");
    cartList.arrCartList = arrInCart;
    cartList.updateItem(cartItemName, cartItemQty);
    // console.log(cartList.arrCartList);
    const result = convertArrToObj(cartList.arrCartList);
    setItemLocalStorage(result);
    renderCartList();
}

checkOut = () => {
    getEle("closeCartList").click();
    let contentHTML = '';
    let paysum = 0;
    const arrInCart = convertObjToArr("CART_LIST");
    cartList.arrCartList = arrInCart;
    cartList.arrCartList.forEach(ele => {
        const price = parseInt(ele.price);
        const qty = parseInt(ele.qty);
        const pricesum = price * qty;
        paysum += pricesum;
        contentHTML += `
        <tr class="text-success">
            <td>${ele.name}</td>
            <td>${ele.qty}</td>
            <td>$${pricesum}</td>
        </tr>
        `
    });
    paysum = '$' + paysum;
    getEle("paysumPurchase").innerHTML = paysum;
    getEle("contentPurchase").innerHTML = contentHTML;
}

purChase = () => {
    getEle("closeCheckOut").click();
    let orderNum = Math.floor(Math.random() * 1001);
    const orderNumContent = "Your order number: #" + orderNum;
    getEle("orderNum").innerHTML = orderNumContent;
}

confirmOrder = () => {
    localStorage.removeItem("CART_LIST");
    cartList.arrCartList = [];
    // console.log(cartList.arrCartList);
    getEle("closeContinueShopping").click();
}

