const Product = require("./products");

class ProductManager {
    #products = [];
    #idNumber = 0;

    _addProduct(data) {
    if (this._validateCode(data[4])) {
            console.error("Codigo repetido, ingrese otro codigo");
            return;
        }

    if (this._validateObject(data)) {
            console.error("Complete todos los campos");
            return;
        }

    this._generateID();
    const product = new Product(this.#idNumber, ...data);
    this.#products.push(product);
    console.log(product);
    }

    _getProducts() {
        console.table(this.#products);
        return this.#products;
    }

    getProductById(id) {
        const product = this.#products.find((p) => p.id === id);
        if (!product) {
            console.error("Not found");
            return;
        }
        console.log(product);
        return product;
    }

    _generateID() {
        this.#idNumber++;
    }

    _validateCode(code) {
        if (this.#products.find((p) => p.code === code)) {
            return true;
        }
    }

    _validateObject(data) {
        if (data.length !== 6) return true;
        data.some((el) => {
            if (el === "" || el === undefined || el === null) return true;
        });
    }
}

const test = new ProductManager();

test._addProduct(["Remera", "roja", 150, "http://", "123abc", 20]);
test._addProduct(["Remera", "negra", 130, "http://", "456abc", 20]);
test._addProduct(["Remera", "azul", 110, "http://", "789abc", 30]);
test._addProduct(["Remera", "azul", 110, "http://", "123abc", 20]); // output: Codigo repetido, ingrese otro codigo;
test._addProduct(["Remera", , 110, "http://", "phtabc"]); // output: Complete todos los campos;
test._addProduct(["Remera", "azul", 110, "", "kyhabc"]); // output: Complete todos los campos;
test._getProducts();
test.getProductById(1);
test.getProductById(5);

