class CartList {
    arrCartList = [];

    addCart(item) {
        this.arrCartList.push(item);
    };

    findIndex(id) {
        let index = -1;
        this.arrCartList.forEach((item, idx) => {
            if (item.id === id) {
                index = idx;
            }
        });
        return index;
    };

    deleteItem(id) {
        const index = this.findIndex(id);
        if (index !== -1) {
            this.arrCartList.splice(index, 1);
        }
    };

    updateItem(name, qty) {
        this.arrCartList.forEach(ele => {
            if (ele.name === name) {
                ele.qty = qty;
            }
        });
    }
}