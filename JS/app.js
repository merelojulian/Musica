let mostrarCarrito = document.querySelector('.icon-cart');
let cerrarCarrito = document.querySelector('.closeCart');
let body = document.querySelector('body');
let cargarProductos = document.querySelector('.listProduct');
let cargarCarrito = document.querySelector('.listCart');
let contadorCarrito = document.querySelector('.icon-cart span');
let eliminarCarrito = document.querySelector('.deleteCart');
let listProducts = [];
let carts = [];

mostrarCarrito.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

cerrarCarrito.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Carga la info de los productos al html
const addDataToHTML = () => {
    try {
        cargarProductos.innerHTML = '';
        if (listProducts.length > 0) {
            listProducts.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = `
                    <img src="${product.image}" alt="" class="card__img">
                    <h3 class="card__name">${product.name}</h3>
                    <div class="card__price">$${product.price}</div>
                    <button class="card__button">Añadir Al Carrito</button>`;
                cargarProductos.appendChild(newProduct);
            });
        }
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
};


// Permite añadir productos al carrito
cargarProductos.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('card__button')) {
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);


        Toastify({
            text: "Añadido al carrito",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        }).showToast();
    }
});

// Setea en el Local Storage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}

// Carga la info de los productos al carrito
const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if (positionThisProductInCart < 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        carts[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
};


// Calcula el valor del precio total 
const calcularTotal = () => {
    let total = 0;
    carts.forEach(cart => {
        let product = listProducts.find(product => product.id == cart.product_id);
        if (product) {
            total += product.price * cart.quantity;
        }
    });
    return total;
};


// Carga el html del producto al carrito y calcula cantidad y precio de un mismo producto
const addCartToHTML = () => {
    cargarCarrito.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;

    if (carts.length > 0) {
        carts.forEach(cart => {

            const product = listProducts.find(p => p.id == cart.product_id);
            if (!product) return;

            totalQuantity += cart.quantity;
            totalPrice += product.price * cart.quantity;

            const newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            newCart.innerHTML = `
                <div class="image">
                    <img src="${product.image}" alt="">
                </div>
                <div class="name">${product.name}</div>
                <div class="totalPrice">$${(product.price * cart.quantity).toFixed(2)}</div>
                <div class="quantity">
                    <span class="minus">&lt;</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">&gt;</span>
                </div>`;
            cargarCarrito.appendChild(newCart);
        });
    } else {

        const emptyCartMessage = document.createElement('div');
        emptyCartMessage.classList.add('empty-cart');
        emptyCartMessage.textContent = 'El carrito está vacío.';
        cargarCarrito.appendChild(emptyCartMessage);
    }

    const totalElement = document.createElement('div');
    totalElement.classList.add('cart-total');
    totalElement.innerHTML = `
        <div class="total">
            <span>Total:</span>
            <span>$${totalPrice.toFixed()}</span>
        </div>`;

    cargarCarrito.appendChild(totalElement);
    contadorCarrito.innerText = totalQuantity;
};

// Permite sumar o restar un producto desde el carrito
cargarCarrito.addEventListener('click', (event) => {
    const positionClick = event.target;

    const itemElement = positionClick.closest('.item');
    if (!itemElement) return;

    const product_id = itemElement.dataset.id;
    if (!product_id) return;

    if (positionClick.classList.contains('plus')) {
        changeQuantity(product_id, 'plus');
    } else if (positionClick.classList.contains('minus')) {
        changeQuantity(product_id, 'minus');
    }
});

// Muestra la cantidad de productos que hay en el carrito
const changeQuantity = (product_id, type) => {
    const positionItemInCart = carts.findIndex((value) => value.product_id == product_id);

    if (positionItemInCart < 0) return;

    if (type === 'plus') {
        carts[positionItemInCart].quantity += 1;
    } else if (type === 'minus') {
        carts[positionItemInCart].quantity -= 1;

        if (carts[positionItemInCart].quantity <= 0) {
            carts.splice(positionItemInCart, 1);
        }
    }
    addCartToMemory();
    addCartToHTML();
};

// Elimina el carrito en su totalidad
eliminarCarrito.addEventListener('click', () => {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",

    }).then((result) => {
        if (result.isConfirmed) {
            carts = [];
            addCartToHTML();
            localStorage.removeItem('cart');

            Swal.fire({
                title: "¡Eliminado!",
                text: "El carrito ha sido vaciado.",
                icon: "success",
            });
        }
    });
});


// Inicia la App
const initApp = () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            listProducts = data;
            addDataToHTML();

            if (localStorage.getItem('cart')) {
                carts = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        })
};

initApp();
