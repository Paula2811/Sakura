//Creamos el nav
class Nav{
    constructor (inicio,productos, contacto){
        this.inicio = inicio;
        this.producto = productos;
        this.contacto = contacto;
    }
}
const navbar = [new Nav("inicio","Productos","Contacto")];
let acumuladorNav = ``;
navbar.forEach((elemento) =>{
    acumuladorNav += `<a class="nav-link active navbar__listaMenu " aria-current="page" href="">${elemento.inicio}</a>
                        <a class="nav-link navbar__listaMenu" href="">${elemento.producto}</a>
                        <a class="nav-link navbar__listaMenu" href="">${elemento.contacto}</a>
                        <form class="d-flex">
                            <button class="btn btn-outline-dark" type="submit">
                                <i class="bi-cart-fill me-1"></i>
                                <img src="elementos/imagenes/carrito.png" alt="Compras" width="30" height="24"
                                    class="imagenLogo2">
                                <span id="contadorCarrito"  class="badge bg-dark text-white ms-1 rounded-pill">0</span>
                            </button>
                        </form>`
});
$("#navbar").html(acumuladorNav);


//Objeto Producto
class Producto {
    constructor(title,price,stock,img){
        this.title = title;
        this.price = price;
        this.stock = stock;
        this.img = img;
    }
    
}

const producto_uno = new Producto("Cuaderno Cherhane Funcional A5",1050,10,"elementos/imagenes/card/cuaderno.jpg");
const producto_dos = new Producto("Organizador FW Serie Fun Shine",1355,6,"elementos/imagenes/card/fw.jpg");
const producto_tres = new Producto("Resaltador Stabilo Swing Cool Pastel X6",955,8,"elementos/imagenes/card/stabilo-resaltadoe.gif");

//Array de Productos
const baseDeDatos = [producto_uno, producto_dos, producto_tres];

//Array de ordenar por stock
let ordenarStock = [];
ordenarStock = baseDeDatos.map(stock => stock);
ordenarStock.sort(function (a,b){
    return a.stock - b.stock;
});
console.log("Productos ordenados por stock de forma ascendente: ")
console.log(ordenarStock);

//Creamos las Cards de productos

//Ajax 
// get con jquery
$.getJSON("productos.json",function(res){
    let acumulador=``;
    res.forEach((producto) => {
    acumulador+= `<div class="card mb-3 galeriaConteiner">
                    <img src="${producto.img}" class="card-img-top imagenProductos" alt="...">
                    <div class="card-body galeriaImagen">
                        <h5 class="card-title">${producto.title}</h5>
                        <p class="card-text">$${producto.price}</p>
                        <button class="btn btn-primary button">Agregar al carrito</button>
                    </div>
                </div>`
    });
    $("#productos").html(acumulador);
    const clickButton = document.querySelectorAll('.button');
    clickButton.forEach(btn =>{
        btn.addEventListener('click',agregarAlCarrito)
    })
    })

//Evento formulario con JQuery

$("#botonFormulario").click(function(){
    let nombre = $('#nombre').val();
    let email = $('#email').val();
    let mensaje = $('#mensaje').val();
    let datos = {
            nombre : nombre,
            email: email,
            mensaje: mensaje
        }
    console.log("Datos ingresados en Contacto son "+JSON.stringify(datos));
    localStorage.setItem("Contacto", JSON.stringify(datos));
    //Animacion con JQuery
    $('.alert4').slideDown(1000)
                .slideUp(1500);
})

//Carrito
const tbody = document.querySelector('.tbody');
let carrito = [];


function agregarAlCarrito(e){
    
    const button = e.target;
    const item = button.closest('.card');
    const itemTitles = item.querySelector('.card-title').textContent;
    const itemPrice = item.querySelector('.card-text').textContent;
    const newItem = {
        title: itemTitles,
        precio: itemPrice,
        cantidad: 1
    }
    addProductToCarrito(newItem)
    
}

function addProductToCarrito(newItem){
    
    //Animacion con JQuery
    $('.alert1').slideDown(2000)
                .slideUp(2000);
    

    const InputElemnto = tbody.getElementsByClassName('input__elemento')
    for(let i =0; i < carrito.length ; i++){
        if(carrito[i].title.trim() === newItem.title.trim()){
        carrito[i].cantidad ++;
        const inputValue = InputElemnto[i]
        inputValue.value++;
        carritoTotal()
        return null;
        }
    }
    carrito.push(newItem);
    renderCarrito()
    
}

function renderCarrito(){
    tbody.innerHTML = '';
    carrito.map(item =>{
        const tr = document.createElement('tr');
        tr.classList.add('itemCarrito');
        const content = `<td class="table__productos">
                            <h6 class="title">${item.title}</h6>
                        </td>
                        <td class="table__price">
                            <p>${item.precio}</p>
                        </td>
                        <td class="table__cantidad">
                            <input type="number" min="1" value="${item.cantidad}" class="input__elemento">
                            <button class="delete btn btn-danger">X</button>
                        </td>`
        tr.innerHTML = content;
        tbody.append(tr)
        tr.querySelector(".delete").addEventListener('click', removeItemCarrito);
        tr.querySelector(".input__elemento").addEventListener('change',sumaCantidad)
        
    })
    carritoTotal()
}

function carritoTotal(){
    let total = 0;
    const itemCartTotal = document.querySelector('.itemCantTotal')
    carrito.forEach((item) => {
        const precio = Number(item.precio.replace("$", ''))
        total = total + precio*item.cantidad
    })
    itemCartTotal.innerHTML = `Total $${total}`
    addLocalStorage()
}

function removeItemCarrito(e){
    const buttonDelete = e.target
    const tr = buttonDelete.closest('.itemCarrito')
    const title = tr.querySelector('.table__productos').textContent
    for(let i = 0; i < carrito.length; i++){
        if(carrito[i].title.trim()===title.trim()){
            carrito.splice(i, 1)
        }
    }
    tr.remove()
    carritoTotal()

    //Animacion con JQuery
    $('.alert2').slideDown(1000).slideUp(1500)
            
}

function  sumaCantidad(e){
    const sumaInput  = e.target
    const tr = sumaInput.closest(".itemCarrito")
    const title = tr.querySelector('.title').textContent
    carrito.forEach(item => {
        if(item.title.trim() === title){
            sumaInput.value < 1 ?   (sumaInput.value = 1) : sumaInput.value;
            item.cantidad = sumaInput.value;
            carritoTotal()
        }
    })
    
}

function addLocalStorage(){
    localStorage.setItem('carrito',JSON.stringify(carrito))
    document.getElementById("contadorCarrito").innerHTML = carrito.length;
}

window.onload = function() {
    if(localStorage.carrito != null){
        carrito = JSON.parse(localStorage.carrito);
        renderCarrito();
    }
}

$(".btnComprar").click(function(){
    //Animacion con JQuery
    $('.alert3').slideDown(1000)
                .slideUp(1500);
})