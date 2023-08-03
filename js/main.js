// Obtener el formulario
const form = document.getElementById("form");

// Obtener la barra de busqueda
const search = document.getElementById("search");

//Obtener el widget del usuario
const userCard = document.getElementById("usercard");

// Escuchar el evento submit del form
form.addEventListener("submit", (evt) => {
    evt.preventDefault(); //No recargar la página

    const username = search.value;

    getUserData(username);

    // Se limpia el campo Search
    search.value = "";
});

// Obtener la información del usuario en GitHub
async function getUserData(username) {
    
    const urlAPI = "https://api.github.com/users/";

    try {

        // Hacer petición a la url
        const userRequest = await fetch(urlAPI + username);

        //Verificar si existe el usuario
        if(!userRequest.ok) {
            // Si no existe el usuario
            // Lanzar error
            throw new Error(userRequest.status);
        }

        // Obtener el json data del usuario
        const userData = await userRequest.json();
        
        // Averiguar si el usuario tiene repositorios
        if(userData.public_repos) {
            // Peticion a la url de la API "repos" del usuario
            const reposRequest = await fetch(urlAPI + username + "/repos");
            // Obtener el json
            const reposData = await reposRequest.json();

            // Darle el json de repositorios a un objeto Nuevo para el json del usuario que estara ahi guardado
            userData.repos = reposData;
        }

        // Mostrar los datos del usuario
        showUserData(userData);


    } catch(error) {
        showError(error.message);
    }    
}

// Función para componer e hidratar el HTML del widget
function showUserData(userData){

    // Se crea el contenido del usuario
    let userContent = `
        <img src="${userData.avatar_url}" alt="Avatar">
        <h1>${userData.name}</h1>
        <p>${userData.bio}</p>

        <!-- Inicia data -->
        <section class="data">
            <ul>
                <li>Followers: ${userData.followers}</li>
                <li>Following: ${userData.following}</li>
                <li>Repos: ${userData.public_repos}</li>
            </ul>
        </section>
        <!-- Termina data -->        
    `

    // Si el usuario tiene repositorios
    if (userData.repos) {
        // Añadirle los repositorios
        userContent+= `
        <!-- Inicia .repos -->
        <section class="repos">
        `

            userData.repos.slice(0, 7).forEach(repo => {
                userContent += `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`
            })

        userContent += `</section>
        <!-- Termina .repos -->
        `
    }

    // Añadir el contenido en el html del widget del usuario
    userCard.innerHTML = userContent;
}

// Función para gestionar los errores
function showError(error) {
    // Crear contenido del error
    const errorContent = `
    <h1>Error ⚠ ${error}</h1>
    `

    userCard.innerHTML = errorContent;
}