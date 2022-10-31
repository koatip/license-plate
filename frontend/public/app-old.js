'use strict';

const endpoint = 'http://localhost:5000/search';
let input = document.querySelector('input[type=text]')
console.log(input);

const button = document.querySelector('button')
console.log(button);

let regForm = document.getElementById('reg-form')

// function getAutos(endpoint) {
//     let licenseInput = input.value
//     fetch(`${endpoint}?q=${licenseInput}`)
//         // fetch(`${endpoint}`)
//         // fetch(endpoint)
//         .then((response) => response.json())
//         .then((data) => {
//             console.log(data)
//             // data.results.forEach(person => {
//             //     nameContainer.innerHTML += `<li class="person" onclick="clicked(this)">${person.name}</li>`
//             // })
//         })
//         .catch(error => console.error(error.message))
// }

// button.addEventListener('submit', regForm)

regForm.addEventListener('submit', (event) => {
    // novalidate rátenni a formra!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    event.preventDefault(); // böngésző újratöltésének megakadályozása
    const formElement = event.target;

    let isValid = formElement.checkValidity(); //ha minden validáció sikeresen lefutott true-val tér vissza

    if (isValid) {       // ha true, akkor eltávolítjuk a form-ról .was-validated osztályt
        // happy path
        regForm.submit()
        //*  formElement.classList.remove('was-validated');   // form-ról távolítjuk el az osztályt

        //*  const output = document.getElementById("output");    //alert-et változóba mentjük
        //*  output.classList.remove("d-none");              //levesszük a d-none (display none) osztályt, h látsszon az alert
        //*  output.textContent = 'Sikeres regisztráció!';   // sikeres submit esetén egy alertben megjelenik ez a szöveg

        //let licenseInput = input.value
        // fetch(`${endpoint}?q=${licenseInput}`)
        fetch('http://localhost:5000/search')

            //URLSearchParams!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // https://github.com/green-fox-academy/radial-syllabus/blob/master/material-review/week-14/day-2-promise-async-await/frontend/public/main.js

            // fetch(`${endpoint}`)
            // fetch(endpoint)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                // data.results.forEach(person => {
                //     nameContainer.innerHTML += `<li class="person" onclick="clicked(this)">${person.name}</li>`
                // })
            })
            .catch(error => console.error(error.message))
        regForm.reset();        // form alapértékre állítása, de az alert marad látható
    } else {                                         // ha false, tehát hiba van, akkor rátesszük a .was-validated osztályt
        //* formElement.classList.add('was-validated');   // form-ra tesszük rá a was-validated osztályt!!!!!!!!!!!!!!!! Piros keretet ad és megjeleníti a hibát a div-ben
        console.log('hiba');
    }
})