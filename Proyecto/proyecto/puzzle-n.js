/**
 * -----------------------------------------------------------------
 * Integrantes:
 * Salamanca Campos	Andrey	andsala@estudiantec.cr
 * Valverde Marin	Estefani Tatiana	2021554564@estudiantec.cr		
 * Valverde Villachica	Jhonner	jhonner@estudiantec.cr		
 * Xie Li	Dayana	dxie@estudiantec.cr	
 * 	
 * -----------------------------------------------------------------
 */

/**
 * -----------------------------------------------------------------
 * Variables globales
 * -----------------------------------------------------------------
 */

let ImagenEscogida;
const listadePiezas = [];
const imagCortadas = [];
let listaId = [];
let resultado = [];
var celda;
var celdaVacia; 
let estadoInicial = [];
let estadoObjetivo = [];

var ids = [];
var cantPiezas = 0;
let matrizPasoAnterior = []
var matrizImageneCreada = [];
let matricesOperadas = [];
var solucion = [];
var solucionDic = {};

/**
 * -----------------------------------------------------------------
 * Interfaz
 * -----------------------------------------------------------------
 */

/**
 * Función que selecciona la imagen presionada por la persona usuaria.
 * @param {*} src 
 */

function SeleccionarImagen(src) {
    document.querySelectorAll('.Imagen').forEach(Imagen => {
        Imagen.classList.remove('Escogida');
    });
    
    const Imagen = document.querySelector(`.Imagen[src="${src}"]`);
    Imagen.classList.add('Escogida');
    
    ImagenEscogida = src;

    //ActualizarFondoTablero();
}

/**
 * Función que crea el tablero según el tamaño que desea la personas usuaria.
 */

function CrearTableroAleatorioCuadrado() {
    const size = document.getElementById('TiposDeTablero').value;
    const contenedor = document.getElementById('contenedor');
    
    contenedor.style.setProperty('--size', size);
    contenedor.innerHTML = '';

    for (let f = 0; f < size; f++) {
        const fila = [];
        for (let c = 0; c < size; c++) {
            // Crea un div para representar una celda del tablero
            let pieza = document.createElement('div');
            pieza.id = f.toString() + '-' + c.toString();
            pieza.classList.add('Celda');
            
            // Agrega la celda al contenedor
            contenedor.appendChild(pieza);

            // Agregar la pieza a lista
            fila.push(pieza.id);

            //Mover piezas
            pieza.addEventListener("click", play);
        }
        listadePiezas.push(fila);
        
    }
    celdaVacia = document.getElementById((size - 1) + '-' + (size - 1));
    celdaVacia.style.filter = "grayscale(100%)"; 
    console.log(listadePiezas);

    ActualizarFondoTablero();

}

/**
 * Funcion que recorta la imagen en pedazos para actualizar el tablero
 */

function ActualizarFondoTablero() {
    if (!ImagenEscogida){
        alert("Seleccione la imagen y el tamaño a la que quiere jugar. Luego dale shuffle");
        return;
    }
    var newImage = new Image();
    newImage.src = ImagenEscogida;

    matrizImageneCreada = [];

    cantPiezas = document.getElementById('TiposDeTablero').value;
    // imagCortadas = [];
    // ver si ocupa un resize
    sizePiezas = document.querySelector('.Celda').offsetWidth - 1.5;
    for(let i = 0; i < cantPiezas; ++i){
        var fila = [];
        for(let j= 0; j < cantPiezas; ++j){
            // pixeles donde va a cortar
            x = i * sizePiezas;
            y = j * sizePiezas;
            let pedazo = document.createElement("canvas");
            pedazo.width = sizePiezas;
            pedazo.height = sizePiezas;
            let context = pedazo.getContext("2d");
            // 0, 0 es donde se va a pegar en el canvas
            context.drawImage(newImage, x,y, sizePiezas, sizePiezas, 0, 0,sizePiezas,sizePiezas);
            // guardar las imagenesen una lista
            imagCortadas.push(pedazo.toDataURL("image/jpg"));
            fila.push([j,i]);
        }
        matrizImageneCreada.push(fila);
    }   
    console.log(imagCortadas);   
      
    mostrarFondoActualizado(imagCortadas);

}

/**
 * Funcion que actualiza la el tablero con las imagenes recortadas
 * @param {number[]} imagCortadas imagenes ya recortadas
 */

function mostrarFondoActualizado(imagCortadas){
    // los pedazos pueden agraegarse a un div en el html
    var scope = document.querySelectorAll('.Celda');
    //console.log("Aqui " + imagCortadas.length);
    for(let i = 0; i < imagCortadas.length; ++ i){
        var imgElement = document.createElement("img");
        imgElement.src = imagCortadas[i];

        imgElement.id = i;
        scope[i].appendChild(imgElement);
    }
    actualizarListaId()
       
}

/**
 * Revuelve de forma aleatoria las celdas del contenedor
 */
function shuffle(){
    const celdas = document.querySelectorAll('.Celda');
   

    // random
    for (let i = 0; i < imagCortadas.length - 1; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = imagCortadas[i];
        imagCortadas[i] = imagCortadas[j];
        imagCortadas[j] = temp;
    }

    
    // insert 
    celdas.forEach(function(celda, i){
        celda.innerHTML = ''; 
        const imgElement = document.createElement('img');
        imgElement.src = imagCortadas[i];
        imgElement.id = i.toString();
        celda.appendChild(imgElement);
    });
}

/**
 * ----------------------------------------------
 * JUGABILIDAD
 * ----------------------------------------------
 */

/**
 * Hace referencia y llamada a las celdas que se pueden mover.
 */
function play() {
    if (moverCeldaVacia(this)) {
        console.log(celdaVacia);
        cambiarCeldas(this, celdaVacia);
        

        celdaVacia = this;
    }
}

/**
 * Verifica si una celda se puede mover.
 * @param {celda} cell 
 * @returns true or false
 */

function moverCeldaVacia(cell) {
    let indice = cell.id.split("-");
    console.log(indice);
    let f = parseInt(indice[0]);
    let c = parseInt(indice[1]);

    let indiceVacia = celdaVacia.id.split("-");
    console.log(indiceVacia);
    let f2 = parseInt(indiceVacia[0]);
    let c2 = parseInt(indiceVacia[1]);

    let mismaFila = f == f2;
    let izquerda = c == c2 - 1;
    let derecha = c == c2 + 1;

    let mismaColumna = c == c2;
    let arriba = f == f2 - 1;
    let abajo = f == f2 + 1;
     
    return (
        (mismaFila && (izquerda || derecha)) || // Comprobación horizontal
        (mismaColumna && (arriba || abajo))    // Comprobación vertical
    );
}

/**
 * Intercambia la celda "identificadora" por la que esta al lado
 * @param {celda-identificadora} vacia 
 * @param {celdas que rodean a la identificadora} lado 
 */

function cambiarCeldas(vacia, lado) {
    // se cambia el contenido de las celdas
    const tempInnerHTML = vacia.innerHTML;
    vacia.innerHTML = lado.innerHTML;
    lado.innerHTML = tempInnerHTML;

    // se cambia el filtro de las imagenes
    vacia.style.filter = "grayscale(100%)"; 
    lado.style.filter = ""; 
    actualizarListaId();
    
}

/**
 * -----------------------------------------------------------------
 * Backtraking
 * -----------------------------------------------------------------
 */

/**
 * function que pausa el juego por un tiempo
 * @param {number} ms milisegundos para dormir
 */

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Funcion que pasa la matriz actual a su correspondiente numero id
 *
 * @param {number[]} matriz tablero actual
 * @returns {number[]} el tablero actual con su correspondiente numero id
 */

function pasarMatrizNumerica(matriz){
    var matrizNumerica = [];
    for(let i = 0; i < cantPiezas; ++i){
        var fila = [];
        for(let j = 0; j < cantPiezas; ++j){
            var numero = matriz[i][j][0] * cantPiezas + matriz[i][j][1];
            fila.push(numero);

        }
        matrizNumerica.push(fila);
    }
    return matrizNumerica;
}

/**
 * Funcion que busca la posicion de la celda vacia
 *
 * @param {number[]} matriz tablero actual
 * @returns {number[]} fila y columna de la celda vacia
 */
function buscarVacia(matriz){
    for(var fila = 0; fila < matriz.length; ++fila){
        for(var columna = 0; columna < matriz.length; ++columna){
            // asumimos que el vacio va a el ultimo pedazo de imagen, derecha abajo
            var ultimo = (matriz.length * matriz.length) - 1;
            if(matriz[fila][columna] == ultimo && matriz[fila][columna] == ultimo){
                return [fila, columna];
            }
        }
    }
}


/**
 * Esta función busca las cordenadas de la celda vacia
 *
 * @param {number[]} matriz - La matriz de números en la que se realizará la operación.
 * @returns {number[]} fila y columna donde se encuentra la posicion vacia
 */

function buscarPosicionVaciaMatrizNumerica(matriz){
    for (let i = 0; i < matriz.length; ++i) {
        for (let j = 0; j < matriz.length; ++j) {
            if(matriz[i][j] == (matriz.length * matriz.length - 1)){
                return [i,j];
            }
        }
    }
}


/**
 * Funcion que cambia las posiciones de los numeros en la matriz
 *
 * @param {number[]} matriz tablero actual
 * @param {number[]} fila fila actual
 * @param {number[]} columna columna actual
 * @param {number[]} fila2 fila a mover
 * @param {number[]} columna2 columna a mover
 * @returns {number[]} la matriz con el cambio hecho
 */
function swapPosicionCero(matriz, fila, columna, fila2, columna2){
    var copia = matriz.map((item) => item.slice());
    var numero = copia[fila][columna];
    copia[fila][columna] = copia[fila2][columna2];
    copia[fila2][columna2] = numero;
    return copia;
}

/**
 * Esta función genera los posibles movimientos que se pueden hacer a partir de la casilla vacia
 *
 * @param {number[]} tableroAct tablero actual
 * @returns {number[]} las matrices con los posibles movimientos
 */

function generarSoluciones(tableroAct){
    [fila, columna] = buscarVacia(tableroAct);
    var soluciones = [];
    // moverlo arriba
    if(fila - 1 >= 0){
        soluciones.push(swapPosicionCero(tableroAct, fila, columna, fila - 1, columna));
    }
    // moverlo abajo
    if(fila + 1 < tableroAct.length){
        soluciones.push(swapPosicionCero(tableroAct, fila, columna, fila + 1, columna));
    }
    // moverlo izquierda
    if(columna - 1 >= 0){
        soluciones.push(swapPosicionCero(tableroAct, fila, columna, fila, columna - 1));
    }
    // moverlo derecha
    if(columna + 1 < tableroAct.length){
        soluciones.push(swapPosicionCero(tableroAct, fila, columna, fila, columna + 1));
    }
    //console.log(soluciones);
    return soluciones;
}

/**
 * Esta función verifica si la matriz actual ya fue operada
 *
 * @param {number[]} matriz1 La matriz actual.
 * @returns {boolean} true si ya fue operada, false si no
 */
function matrizFueOperada(matriz){
    for(let i = 0; i < matricesOperadas.length; ++i){
        if(matricesOperadas[i].toString() == matriz.toString()){
            return true;
        }
    }
    return false;
}

/**
 * Esta función retorna los movimientos realizados en string.
 *
 * @param {number[]} matriz1 La matriz actual.
 * @param {number[]} matriz2 La matriz anterior.
 * @returns {string} pasos realizados
 */
function obtenerMovimientos(matriz1, matriz2){
    let movimiento = "";
    let posCero1 = buscarPosicionVaciaMatrizNumerica(matriz1);
    let posCero2 = buscarPosicionVaciaMatrizNumerica(matriz2);
    if(matriz1.length == 0 || matriz2.length == 0){
        return movimiento;
    }
    if(posCero1[0] > posCero2[0]){
        movimiento = "Mover hacia arriba";
    }
    else if(posCero1[0] < posCero2[0]){
        movimiento = "Mover hacia abajo";
    }
    else if(posCero1[1] > posCero2[1]){
        movimiento = "Mover hacia la izquierda";
    }
    else if(posCero1[1] < posCero2[1]){
        movimiento = "Mover hacia la derecha";
    }
    return movimiento;

}


/**
 * Funcion que mueve la celda segun la direccion obtenida.
 * @param {number} direccion la direcion a mover
 */
function moverCeldaSegunDireccion(direccion) {
    let indiceVacia = celdaVacia.id.split("-");
    let f2 = parseInt(indiceVacia[0]);
    let c2 = parseInt(indiceVacia[1]);

    let nuevaFila = f2;
    let nuevaColumna = c2;

    if (direccion === 0 && f2 > 0) {
        nuevaFila = f2 - 1; // Mover hacia arriba
    } else if (direccion === 1 && f2 < cantPiezas - 1) {
        nuevaFila = f2 + 1; // Mover hacia abajo
    } else if (direccion === 2 && c2 < cantPiezas - 1) {
        nuevaColumna = c2 + 1; // Mover hacia la derecha
    } else if (direccion === 3 && c2 > 0) {
        nuevaColumna = c2 - 1; // Mover hacia la izquierda
    } else {
        // Dirección no válida, no se realiza ningún movimiento
        return;
    }
    // Realiza el intercambio de celdas
    let celdaNueva = document.getElementById(nuevaFila.toString() + '-' + nuevaColumna.toString());
    if (moverCeldaVacia(celdaNueva)) {
        cambiarCeldas(celdaNueva, celdaVacia);
        celdaVacia = celdaNueva;
    }
}



/**
 * Funcion que obtiene la direccion que se puede movio la vacia
 *
 * @param {number[]} matriz1 La matriz actual.
 * @param {number[]} matriz2 La matriz anterior.
 * @returns {number} El movimiento realizado
 */

function obtenerDireccion(matriz1, matriz2){
    let movimiento = "";
    let posCero1 = buscarPosicionVaciaMatrizNumerica(matriz1);
    let posCero2 = buscarPosicionVaciaMatrizNumerica(matriz2);
    if(matriz1.length == 0 || matriz2.length == 0){
        return movimiento;
    }
    if(posCero1[0] < posCero2[0]){
        movimiento = 0; // arriba
    }
    else if(posCero1[0] > posCero2[0]){
        movimiento = 1; // abajo
    }
    else if(posCero1[1] > posCero2[1]){
        movimiento = 3; // izquierda
    }
    else if(posCero1[1] < posCero2[1]){
        movimiento = 2; // derecha
    }
    return movimiento;

}





/**
 * Funcion que hace todo el procesamiento de back
 * @constructor
 * @param {number[]} matrizActual 
 * @param {number} limite 
 */

async function backtracking(matrizActual, limite){
    contador++;
    // condicion de parada
    if(contador > limite){
        return false;
    }
    // obtiene la direccion que se puede mover la celda vacia y lo mueve
    moverCeldaSegunDireccion(obtenerDireccion(matrizActual, matrizPasoAnterior));
    await sleep(70);

    if(contador <= limite){ 
        // si encontro la solucion
        if(matrizActual.toString() == matrizSolucionNumerica.toString()){
            contador = 0;
            matricesOperadas.push(matrizActual);
            let movimientosRealizados = obtenerMovimientos(matrizPasoAnterior, matrizActual);
            todosLosMovimientos.push(movimientosRealizados);
            console.log("movimientos realizados");
            console.log(movimientosRealizados);
            // agregarMovimiento(movimientosRealizados);
            return true
        }
        else {
            let posibles_movimientos = generarSoluciones(matrizActual);
            let movimientosRealizados = obtenerMovimientos(matrizPasoAnterior, matrizActual);
            todosLosMovimientos.push(movimientosRealizados);
            matricesOperadas.push(matrizActual);
            // agregarMovimiento(movimientosRealizados);
            matrizPasoAnterior = matrizActual;
            //console.log("movimientos realizados");
            //console.log(movimientosRealizados);
            for(let i = 0; i < posibles_movimientos.length; i++){
                // clonar la matriz de cada posible movimiento
                matrizOperando = JSON.parse(JSON.stringify(posibles_movimientos[i]));
                if(!matrizFueOperada(posibles_movimientos[i])){
                    if(await backtracking(posibles_movimientos[i], limite)){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    return false;
}

/**
 * Funcion para resolver el puzzle por backtracking
 */
async function resolverPorBacktracking() {
    todosLosMovimientos = [];
    var matrizSolucion = [];
    var matrizInicial = matrizImageneCreada.map((item) => item.slice());;   
    // crear la matriz solucion con los indices de 0 a tamanio -1
    for (let i = 0; i < cantPiezas; ++i) {
        var fila = [];
        for (let j = 0; j < cantPiezas; ++j) {
            fila.push([i,j]);
        }
        matrizSolucion.push(fila);
    }
    matrizSolucionNumerica = pasarMatrizNumerica(matrizSolucion);
    console.log("matrizSolucionNumerica " + matrizSolucionNumerica);
    contador = 0;
    // convertir la matriz actual a numeros para identificar cada imagen
    var matrizNumerica = pasarMatrizNumerica(matrizInicial);
    console.log("matrizNumerica " + matrizNumerica);
    var limite = 500;
    var solucion = await backtracking(matrizNumerica, limite);
    // agregarMovimiento(todosLosMovimientos);
    if (!solucion  && contador > 5){
        alert("Se ha superado el limite de iteraciones");
    }
    else if(!solucion){
        alert("No se encontro solucion");
    }
    else{
        alert("Se encontro solucion");
    }
    
}
/**
 * -----------------------------------------------------------------
 * Heurística A*
 * -----------------------------------------------------------------
 */

/**
 * Retorna los identificadores asociados a las imagenes insertadas en cada celda
 */
function actualizarListaId(){
    listaId = []
    for (let f = 0; f < listadePiezas.length; f++) {
        const filaimg = [];

        for (let c = 0; c < listadePiezas[f].length; c++) {
            let celda = document.getElementById(listadePiezas[f][c]);
       
            let img = celda.querySelector('img')
           
            filaimg.push(img.id);     
        }
        listaId.push(filaimg);
    }
    //console.log(listaId);
    ordenarLista(listaId);
}


/**
 * 
 * @returns los identificadores asociados a las imagenes de una manera ordenada
 */
function ordenarLista(){
    // crear funcion para determinar el estadoObjetivo de la listaI
    
    const dimension = listaId.length;
    const resultado = [];
    for (let i = 0; i < dimension; i++) {
        resultado[i] = [];
        for (let j = 0; j < dimension; j++) {
        resultado[i][j] = 0;
        }
    }

    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
        resultado[j][i] = listaId[i][j];
        }
    }
    //console.log(resultado);
    return resultado;
}

/**
 * Representa un nodo en el espacio de búsqueda del algoritmo A*.
 * @param {number[][]} estado - 
 * @param {string[]} camino 
 */
class Nodo {
    constructor(estado, camino) {
        this.estado = estado;
        this.camino = camino;
        this.costoG = cCostoG(camino);
        this.costoH = heuristica(estado, estadoObjetivo);
    }

    get costoTotal() {
        return this.costoF + this.costoH;
    }
}
/**
 * Calcula el costo g, que es la longitud del camino
 * @param {string[]} camino El camino desde el estadoInicial
 * @returns {numbre}El costo g 
 */
function cCostoG(camino){
    return camino.length;
}


/**
 * Calcula el costo heurisitico h, que es la diferencia entre el estado actual y el estado objetivo
 * @param {*} estadoActual matriz del contenedor actual
 * @param {*} estadoObjetivo matriz del contenedor esperado
 * @returns {number} El costo heuristico h 
 */
function heuristica(estadoActual, estadoObjetivo){
    
    estadoActual = listaId;
    estadoObjetivo = ordenarLista();
    let costo = 0;
    for(let i = 0; i < estadoActual.length; i ++){
        for(let j =0; j < estadoActual[i].length; j++){
            if(estadoActual[i][j] != estadoObjetivo[i][j]){
                costo++;
            }
        }
    }
    return costo;

}

/**
 * nodo actual en la búsqueda.
 * @param {Nodo} nodoActual -  los sucesores del nodo actual
 * @returns {Nodo[]} Un arreglo de nodos sucesores.
 */

function estadoSucesor(nodoActual) {
    const sucesores = [];
    const dimension = nodoActual.estado.length;

    let filaVacia;
    let columnaVacia;

    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (nodoActual.estado[i][j] === 0) {
                filaVacia = i;
                columnaVacia = j;
                break;
            }
        }
    }
    
    // Movimiento hacia la izquierda
    if (columnaVacia > 0) {
        let izquierda;
        sucesores.push(izquierda);
    }

    // Movimiento hacia la derecha
    if (columnaVacia < dimension - 1) {
        let derecha;
        sucesores.push(derecha);
    }

    // Movimiento hacia arriba
    if (filaVacia > 0) {
        let arriba;
        sucesores.push(arriba);
    }

    // Movimiento hacia abajo
    if (filaVacia < dimension - 1) {
        let abajo;
        sucesores.push(abajo);
    }

    return sucesores;
}

/**
 * Algoritmo A*.
 * @param {number[][]} estadoInicial - El estado inicial matriz 
 * @param {number[][]} estadoObjetivo - El estado objetivo matriz
 * @returns {string[] | null} movimientos que representa la solución o null 
 */
function aEstrella(estadoInicial, estadoObjetivo) {
    //estadoInicial = actualizarListaId();
    //estadoObjetivo = ordenarLista();

    const buscar = [];
    const explorado = new Set();

    const nodoInicial = new Nodo(estadoInicial, []);
    buscar.push(nodoInicial);

    while (buscar.length > 0) {
        buscar.sort((a, b) => a.costoTotal - b.costoTotal);
        const nodoActual = buscar.shift();

        explorado.add(JSON.stringify(nodoActual.estado));

        // Verificar si el nodo actual está en la posición del estado objetivo
        if (JSON.stringify(nodoActual.estado) === JSON.stringify(estadoObjetivo)) {
            return nodoActual.camino;
        }

        // Generar sucesores
        const sucesores = estadoSucesor(nodoActual);
        for (const sucesor of sucesores) {
            if (!explorado.has(JSON.stringify(sucesor))) {
                const nuevaCamino = [nodoActual.camino,sucesor];
                const nuevoCostoG = cCostoG(nuevaCamino);
                const nuevaHeuristica = heuristica(sucesor, estadoObjetivo);
                const nuevoNodo = new Nodo(sucesor, nuevaCamino, nuevoCostoG, nuevaHeuristica);
                buscar.push(nuevoNodo);
            }
        }
    }
    return null;
}

/**
 * Se obtiene los datos necesarios del estadoinical para inicar la busqueda al estado objetivo
 */
function solucionAestrella() {
    const estadoInicial = listaId; 
    const estadoObjetivo = ordenarLista();     

    // Llama a la función aEstrella y guarda el resultado en una variable
    const resultadoAEstrella = aEstrella(estadoInicial, estadoObjetivo);

    // Verifica si se encontró una solución
    console.log("Estado Inicial: ")
    console.log(listaId)
    console.log("Estado Objetivo: ")
    console.log(ordenarLista());
    if (resultadoAEstrella !== null) {
        console.log("Solución encontrada:");
        const caminoFinal = resultadoAEstrella;
        console.log("Movimientos realizados:", caminoFinal);
    } else {
        console.log("No se encontro una solucion optima.");
    }
}

/**
 * 
 * @returns Verifica que cada imagen de la celda este en la misma posicion que el estado objetivo
 */
function resolver(){

    const celdas = document.querySelectorAll('.Celda');
    
    //imagCortadas = heuristica(imagCortadas)
    for(let i = 0; i < celdas.length; i++){
        const actual = celdas[i];
        const srcActual = actual.querySelector('img').src;
        console.log(imagCortadas);

        if (srcActual != imagCortadas[i] ){
            alert("Error: Aun no esta resuelto");
            return;
        }
    }
    alert("Lo has resuelto");
    return;
}

