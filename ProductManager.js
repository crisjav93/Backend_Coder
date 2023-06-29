import fs from "fs/promises";
import Product from "./products.js";

class ProductManager {
    #path = "./products.json";
    #products = [];
    #idNumber = 0;
    #delete = false;
    constructor() {}
    async #writeFile(data) {
        return await fs.writeFile(this.#path, JSON.stringify(data));
    }
    
    async addProduct(title, description, price, thumbnail, code, stock) {
        try{
            const data = [title, description, price, thumbnail, code, stock];
            this.#products = await this.#readFile();
            if (this.#validateCode(code)){
                console.error('Codigo repetido, ingrese otro codigo');
                return;
            } else if (
                data.some((el) => el === '' || el === undefined || null)
            ) { console.error('Ingrese todos los datos correctamente');
            return;
            } else {
                this.#setId();
                const product = new Product(this.#idNumber, ... data);
                this.#products.push(product);
                await this.#writeFile(this.#products);
                console.log('Ingreso correctamente')
                return;
            }
        } catch (error){
            console.error('Error al momento de agregar el producto!');
        }
    }

    async getProducts() {
        try {
            this.#products = await this.#readFile();
            return this.#products;
        }catch(e) {
            console.error('Error en la lectura de memoria!');
            return;
        }
    }

    async getProductById(idProduct) {
        try {
            this.#products = await this.#readFile();
            const product = this.#products.find((element) => element.id === idProduct);
            return product ? product : 'Producto no encontrado';
        } catch (e) {
            console.error('error al buscar el producto');
        }
        }
        
    
    async updateProduct(id, title, description, price, thumbnail, code, stock){
        try {
            this.#products = await this.#readFile();
            const data = [id, title, description, price, thumbnail, code, stock];
            if (data.some((el) => el === ''  || el === undefined || el === null)) {
                console.error('Ingrese todos los datos correctamente');
                return;
            }
            const index = this.#products.findIndex((element) => element.id === id);
            if (index >= 0) {
                this.#products[index] = new Product (...data);
                await this.#writeFile(this.#products);
                console.log(`se modifico el producto con el ID:${id}`);
                return;
            } else {
                console.error("Error al actualizar el producto");
                return;
            }
        }catch (error) {
            console.error('Error al actualizar el producto');
        }
    }

    async deleteProduct(idProduct){
        try {
            this.#products = await this.#readFile();
            this.#controllerId(idProduct);
            const products = this.#products.filter(
                (element) => element.id !== idProduct
            );
            if (this.#products === products) {
                console.error('No existe el ID indicado');
                return;
            } else {
                await this.#writeFile(products);
                console.log('El producto se borro correctamente');
                return;
            }
        } catch (error) {
            console.error('Error al borrar el producto!');
        }
    }

    async #readFile() {
        try{
            const file = await fs.readFile('./products.json', 'utf-8');
            return JSON.parse(file);
        } catch (e) {
            console.error('Error en la lectura de memoria');
            return;
        }
    }


    #controllerId(idProduct) {
        if (this.#products[this.#products.length - 1].id === idProduct) {
        this.#idNumber = idProduct;
        this.#delete = true;
        }
    }
    #setId() {
        if (!this.#delete) {
            this.#idNumber =
            this.#products.length === 0 ? 1 : this.#products[this.#products.length - 1].id + 1;
        } else {
            this.#idNumber++;
            this.#delete = false;
        }
    }

    #validateCode(code) {
        return this.#products.find((element) => element.code === code) ? true : false;
        }
    }

const test = new ProductManager();

await test.addProduct("Remera", "roja", 150, "http://", "123abc", 20);
await test.addProduct("Remera", "negra", 130, "http://", "456abc", 20);
await test.addProduct("Remera", "azul", 110, "http://", "789abc", 30);
await test.addProduct("Remera", "azul", 110, "http://", "123abc", 20); // output: Codigo repetido, ingrese otro codigo;
await test.addProduct("Remera", '' , 110, "http://", "phtabc"); // output: Complete todos los campos;
await test.addProduct("Remera", "azul", 110, "", "kyhabc"); // output: Complete todos los campos;
await test.getProducts();
await test.getProductById(1);
await test.updateProduct(1,"Remera", "verde", 150, "http://", "123abc", 20);
await test.deleteProduct(2);
