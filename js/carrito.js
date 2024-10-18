let carrito = obtenerCarrito(); // Obtener carrito del localStorage

document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
    
    const cartIcon = document.getElementById('cart-icon');
    const modal = document.getElementById('cart-modal');
    const closeModal = document.querySelector('.close');
    const finalizarCompraBtn = document.getElementById('finalizarCompra');

    // Mostrar el modal del carrito
    cartIcon.onclick = () => {
        modal.style.display = 'block';
    };

    // Cerrar el modal
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    // Finalizar la compra
    finalizarCompraBtn.onclick = () => {
        mostrarFormulario(); 
        modal.style.display = 'none'; 
    };

    // Vaciar el carrito
    document.getElementById('vaciarCarrito').onclick = () => {
        carrito = [];
        actualizarCarrito();
        localStorage.removeItem('carrito');
    };
});

// Mostrar el formulario de datos de envío
function mostrarFormulario() {
    const modal = document.createElement('div');
    modal.id = 'formularioModal';
    modal.classList.add('modal');

    const formContent = `
        <div class="modal-contenido">
            <span class="cerrar-modal">&times;</span>
            <h2>Datos de Envío</h2>
            <form id="formEnvio">
                <input type="text" id="nombre" placeholder="Nombre Completo" required><br>
                <input type="text" id="documento" placeholder="Documento (C.I)" required><br>
                <input type="text" id="direccion" placeholder="Dirección de Envío" required><br>
                <input type="email" id="correo" placeholder="Correo Electrónico" required><br>
                <input type="tel" id="telefono" placeholder="Teléfono" required><br>
                <button type="submit">Finalizar Compra</button>
            </form>
            <div id="mensajeExito" style="display:none; color: green; margin-top: 20px;">Compra finalizada con éxito</div>
        </div>
    `;
    
    modal.innerHTML = formContent;
    document.body.appendChild(modal);

    modal.querySelector('.cerrar-modal').onclick = () => {
        modal.remove();
    };

    // Pre-cargar los datos si existen en localStorage
    cargarDatosFormulario();

    document.getElementById('formEnvio').onsubmit = (e) => {
        e.preventDefault();
        try {
            const nombre = document.getElementById('nombre').value;
            const documento = document.getElementById('documento').value;
            const direccion = document.getElementById('direccion').value;
            const correo = document.getElementById('correo').value;
            const telefono = document.getElementById('telefono').value;

            if (!nombre || !documento || !direccion || !correo || !telefono) {
                throw new Error('Todos los campos son obligatorios');
            }

            localStorage.setItem('datosEnvio', JSON.stringify({ nombre, documento, direccion, correo, telefono }));

            // Mensaje de éxito con SweetAlert
            Swal.fire('¡Compra realizada con éxito!', '', 'success');
            setTimeout(() => {
                modal.remove();
            }, 3000); 
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };
}

// Función para cargar datos pre-cargados en el formulario si están guardados
function cargarDatosFormulario() {
    const datosEnvio = JSON.parse(localStorage.getItem('datosEnvio'));
    if (datosEnvio) {
        document.getElementById('nombre').value = datosEnvio.nombre || '';
        document.getElementById('documento').value = datosEnvio.documento || '';
        document.getElementById('direccion').value = datosEnvio.direccion || '';
        document.getElementById('correo').value = datosEnvio.correo || '';
        document.getElementById('telefono').value = datosEnvio.telefono || '';
    }
}

// Agregar producto al carrito
function agregarAlCarrito(producto) {
    carrito = obtenerCarrito();
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        producto.cantidad = 1;
        carrito.push(producto);
    }

    actualizarCarrito();
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarMensaje('Producto agregado con éxito.');
}

// Eliminar producto del carrito
function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(producto => producto.id !== productoId);
    actualizarCarrito();
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Actualizar la vista del carrito
function actualizarCarrito() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = carrito.length;

    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    carrito.forEach(producto => {
        const item = document.createElement('div');
        item.classList.add('cart-item');
        item.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}">
            <p>${producto.titulo} - $${producto.precio} x ${producto.cantidad}</p>
            <button class="eliminar" data-id="${producto.id}">Eliminar</button>
        `;
        cartItems.appendChild(item);

        item.querySelector('.eliminar').addEventListener('click', () => {
            eliminarDelCarrito(producto.id);
        });
    });

    const totalCompra = carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    document.getElementById('totalCompra').textContent = `Total: $${totalCompra}`;
}

// Obtener carrito del localStorage
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

// Mostrar mensaje con SweetAlert
function mostrarMensaje(mensaje) {
    Swal.fire(mensaje);
}


