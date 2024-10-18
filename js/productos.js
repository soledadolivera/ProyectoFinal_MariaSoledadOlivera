document.addEventListener('DOMContentLoaded', () => {
    try {
        fetch('./productos.json') 
            .then(response => response.json())
            .then(data => mostrarProductos(data.productos)) 
            .catch(error => mostrarError('Error al cargar productos: ' + error));
    } catch (error) {
        Swal.fire('Error', 'Hubo un problema al cargar los productos', 'error');
    }
});

// Mostrar los productos en el DOM
function mostrarProductos(productos) {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';

    productos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('producto-card');
        card.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}">
            <h3>${producto.titulo}</h3>
            <p>${producto.descripcion}</p>
            <p>$${producto.precio}</p>
            <button data-id="${producto.id}">Agregar al Carrito</button>
        `;
        contenedor.appendChild(card);
    });

    document.querySelectorAll('button[data-id]').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const producto = productos.find(p => p.id == id);
            agregarAlCarrito(producto); 
        });
    });
}

// Función para agregar productos al carrito
function agregarAlCarrito(producto) {
    let carrito = obtenerCarrito(); 
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        producto.cantidad = 1;
        carrito.push(producto);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarMensaje('Producto agregado al carrito');
}
