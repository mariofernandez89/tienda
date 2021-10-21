$.getJSON("./data.json", function (baseDeDatos) {
    let carrito = [];
    let total = 0;
    const DOMitems = document.querySelector("#items");
    const DOMcarrito = document.querySelector("#carrito");
    const DOMtotal = document.querySelector("#total");
    const DOMbotonVaciar = document.querySelector("#boton-vaciar");
  
    cargarDatosDesdeElCache();
  
    // Funciones
    function cargarDatosDesdeElCache() {
      try {
        const carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
        carritoGuardado.forEach((elemento) => {
          añadirProductoAlCarrito(elemento);
        });
      } catch (error) {
        console.log("Algo salio mal en cargarDatosDesdeElCache", error);
      }
    }
  
    function renderizarProductos() {
      baseDeDatos.forEach((info) => {
        // Estructura
        const boxStore = document.createElement("div");
        boxStore.classList.add("card", "col-sm-4","border-dark");

        // Body
        const boxContenedor = document.createElement("div");
        boxContenedor.classList.add("card-body");

        // Titulo
        const tituloProducto = document.createElement("h3");
        tituloProducto.classList.add("card-title");
        tituloProducto.textContent = info.nombre;

        // Imagen
        const imagenProducto = document.createElement("img");
        imagenProducto.classList.add("img-fluid");
        imagenProducto.setAttribute("src", info.imagen);

        // Precio
        const boxStorePrecio = document.createElement("p");
        boxStorePrecio.classList.add("card-text");
        boxStorePrecio.textContent = "$ " + info.precio;

        //temperamento
        const temperamentoProducto = document.createElement('p');
        temperamentoProducto.classList.add("card-text");
        temperamentoProducto.textContent="Temperamento:"+ "  "+info.temperamento;


        //tamaño
        const tamañoProducto = document.createElement('p');
        tamañoProducto.classList.add("card-text");
        tamañoProducto.textContent = "Tamaño:" +info.longitud;

        //pH
        const phProducto = document.createElement('p');
        phProducto.classList.add("card-text");
        phProducto.textContent= "pH:" + info.pH

        //dieta
        const dietaProducto = document.createElement('p');
        dietaProducto.classList.add("card-text");
        dietaProducto.textContent= "Dieta:"+ info.dieta;


        // Boton
        const boxStoreBoton = document.createElement("button");
        boxStoreBoton.classList.add("btn", "btn-primary");
        boxStoreBoton.textContent = "Comprar";
        boxStoreBoton.setAttribute("marcador", info.id);
        boxStoreBoton.addEventListener("click", (evento) => {
          const marcador = evento.target.getAttribute("marcador");
          añadirProductoAlCarrito(marcador);
        });

        // Insertamos
        boxContenedor.appendChild(tituloProducto);
        boxContenedor.appendChild(imagenProducto);
        boxContenedor.appendChild(temperamentoProducto);
        boxContenedor.appendChild(tamañoProducto);
        boxContenedor.appendChild(phProducto);
        boxContenedor.appendChild(dietaProducto);
        boxContenedor.appendChild(boxStorePrecio);
        boxContenedor.appendChild(boxStoreBoton,"\n");
        boxStore.appendChild(boxContenedor);
        DOMitems.appendChild(boxStore);
      });
    }
  
    // Evento para añadir un producto al carrito de la compra
  
    function añadirProductoAlCarrito(marcador) {
      // Anyadimos el Nodo a nuestro carrito
      carrito.push(marcador);
      // Calculo el total
      calcularTotal();
      // Actualizamos el carrito
      renderizarCarrito();
    }
  
    //Dibuja todos los productos guardados en el carrito
  
    function renderizarCarrito() {
      // Vaciamos todo el html
      DOMcarrito.textContent = "";
      // Quitamos los duplicados
      const carritoSinDuplicados = [...new Set(carrito)];
      // Generamos los Nodos a partir de carrito
      carritoSinDuplicados.forEach((item) => {
        // Obtenemos el item que necesitamos de la variable base de datos
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
          // ¿Coincide las id? Solo puede existir un caso
          return itemBaseDatos.id === parseInt(item);
        });
        // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
          // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
          return itemId === item ? (total += 1) : total;
        }, 0);
        // Creamos el nodo del item del carrito
        const boxStore = document.createElement("li");
        boxStore.classList.add("list-group-item", "text-right", "mx-2");
        boxStore.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - $ ${miItem[0].precio}`;
        // Boton de borrar
        const miBoton = document.createElement("button");
        miBoton.classList.add("btn", "btn-danger", "mx-5");
        miBoton.textContent = "X";
        miBoton.style.marginLeft = "1rem";
        miBoton.dataset.item = item;
        miBoton.addEventListener("click", borrarItemCarrito);
        // Mezclamos nodos
        boxStore.appendChild(miBoton);
        DOMcarrito.appendChild(boxStore);
      });
    }
  
    function borrarItemCarrito(evento) {
      // Obtenemos el producto ID que hay en el boton pulsado
      const id = evento.target.dataset.item;
      // Borramos todos los productos
      carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
      });
      // volvemos a renderizar
      renderizarCarrito();
      // Calculamos de nuevo el precio
      calcularTotal();
    }
  
    function guardarLista() {
      localStorage.setItem("carrito", JSON.stringify(carrito));
      console.log("La lista se ha guardado con " + carrito.length + "peces:");
      for (nombre of carrito) {
        console.log(nombre.toString());
      }
    }
  
    $("#btnGuardar").on("click", guardarLista);
  
    // Calcula el precio total teniendo en cuenta los productos repetidos
  
    function calcularTotal() {
      // Limpiamos precio anterior
      total = 0;
      // Recorremos el array del carrito
      carrito.forEach((item) => {
        // De cada elemento obtenemos su precio
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
          return itemBaseDatos.id === parseInt(item);
        });
        total = total + miItem[0].precio;
      });
      // Renderizamos el precio en el HTML
      DOMtotal.textContent = total.toFixed(2);
    }
  
    function vaciarCarrito() {
      // Limpiamos los productos guardados
      carrito = [];
      // Renderizamos los cambios
      renderizarCarrito();
      calcularTotal();
    }
  
    DOMbotonVaciar.addEventListener("click", vaciarCarrito);
  
    // Inicio
    renderizarProductos();
  







    /* $(function () {
      //Declaramos la url que vamos a usar para el GET
      const URLGET = "https://jsonplaceholder.typicode.com/users"
      //Escuchamos el evento click del botón mostrar lista vip
      $("#mostrar").click(() => {
          console.log("entro al evento click");
          $.get(URLGET, function (respuesta, estado) {
              console.log(estado);
              console.log(respuesta);
              if (estado === "success") {
                  let misDatos = respuesta;
                  for (const dato of misDatos) {
  
                      $("main.listaVip").append(`
                      <div class="md-card-bg" mbsc-card>
                      <h2 class="md-card-title mbsc-align-center">ID: ${dato.id}  ${dato.name} </h2>
                      <h5 class="md-card-subtitle mbsc-align-center mbsc-bold">${dato.email}</h5>
                      </div>`);
  
  
                  }
              }
          });
      });
  
  
      //Declaramos la información del usuario
  
      alert(' Antes de seguir por favor completa los siguientes datos \n Muchas Gracias');
      const infoPost = {
          name: prompt('Ingresa tu nombre'),
          email: prompt('Ingresa tu email')
      };
  
      //Escuachamos el click del boton Anotate con tu usuario
  
      $("#registro").click(() => {
  
          $.post(URLGET, infoPost, (respuesta, estado) => {
              if (estado == "success") {
                  console.log(respuesta);
                  alert(`el usuario ${respuesta.name} se creo con el id:${respuesta.id}`);
  
              }
          });
      });
  
  
      //Capturamos el click del boton Actualiza la lista
  
      $("#actualiza").click(() => {
  
      //Utilizamos el metodo ajax de jquery con la posibilidad de manipular atributos del mensaje que enviamos a la API
  
          $.ajax({
              method: "POST",
              url: URLGET,
              data: infoPost,
              success: function (resp) {
                  console.log(resp);
                  $("main.listaVip").append(`
                  <div class="md-card-bg" mbsc-card>
                  <h2 class="md-card-title mbsc-align-center">ID: ${resp.id}  ${resp.name} </h2>
                  <h5 class="md-card-subtitle mbsc-align-center mbsc-bold">${resp.email}</h5>
                  </div>`);
  
  
  
              }
  
          });
      });
  
  }); */


}).fail(function (error) {
  console.warn("Algo salio mal tratando de obtener la base de datos", error);


});
  