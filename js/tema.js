const BASEURL = 'http://127.0.0.1:5000';

async function fetchData(url, method, data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null,
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        alert('An error occurred while fetching data. Please try again.');
    }
}

async function showTemas() {
    let temas = await fetchData(BASEURL + '/api/sodafan/', 'GET');
    const tableTemas = document.querySelector('#list-table-temas tbody');
    tableTemas.innerHTML = '';
    temas.forEach((tema) => {
        let tr = `<tr>
            <td>${tema.nombre}</td>
            <td>${tema.albun}</td>
            <td>${tema.creditos}</td>
            <td>
                <button class="btn-fan" onclick='updateTema(${tema.idtemas})'><i class="fa-solid fa-pen-to-square fa-xl"></i></button>
                <button class="btn-fan" onclick='deleteTema(${tema.idtemas})'><i class="fa-regular fa-trash-can fa-xl"></i></button>
            </td>
          </tr>`;
        tableTemas.insertAdjacentHTML("beforeend", tr);
    });
}

async function saveTema() {
    const idtemas = document.querySelector('#idtemas').value;
    const nombre = document.querySelector('#nombre').value;
    const albun = document.querySelector('#albun').value;
    const creditos = document.querySelector('#creditos').value;

    if (!nombre || !albun || !creditos) {
        Swal.fire({
            title: 'Error!',
            text: 'Por favor completa todos los campos.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
        return;
    }

    const temaData = {
        nombre: nombre,
        albun: albun,
        creditos: creditos,
    };
    let result = null;

    if (idtemas!== "") {
        result = await fetchData(`${BASEURL}/api/sodafan/${idtemas}`, 'PUT', temaData);
    } else {
        result = await fetchData(`${BASEURL}/api/sodafan/`, 'POST', temaData);
    }

    const formTema = document.querySelector('#form-tema');
    formTema.reset();
    Swal.fire({
        title: 'Éxito!',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'Cerrar'
    })
    showTemas();
}

function deleteTema(idtemas) {
    Swal.fire({
        title: "¿Está seguro de eliminar el Tema Musical?",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            let response = await fetchData(`${BASEURL}/api/sodafan/${idtemas}`, 'DELETE');
            showTemas();
            Swal.fire(response.message, "", "success");
        }
    });
}

async function updateTema(idtemas) {
    let response = await fetchData(`${BASEURL}/api/sodafan/${idtemas}`, 'GET');
    const idTemas = document.querySelector('#idtemas');
    const nombreN = document.querySelector('#nombre');
    const albunA = document.querySelector('#albun');
    const creditosC = document.querySelector('#creditos');

    idTemas.value = response.idtemas;
    nombreN.value = response.nombre;
    albunA.value = response.albun;
    creditosC.value = response.creditos;
}

document.addEventListener('DOMContentLoaded', function () {
    const btnSaveTema = document.querySelector('#btn-save-tema');
    btnSaveTema.addEventListener('click', saveTema);
    showTemas();
});