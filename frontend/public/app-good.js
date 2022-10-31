'use strict';

const endpoint = 'http://localhost:5000/search';
let input = document.querySelector('input[type=text]')
const button = document.querySelector('button')
let regForm = document.getElementById('reg-form')
let tableBody = document.getElementById("table-body")
let radioValue = ""
let radios = document.querySelectorAll('input[type=radio]')
console.log(radios);

radios.forEach((radioButton) => {
    radioButton.addEventListener("change", (event) => {
        // console.log(event.target.value);
        radioValue = event.target.value
    })
})
console.log(radioValue);

button.addEventListener('click', (e) => {
    table.classList.add('d-none')
    tableBody.innerHTML = ''
    let inputVal = input.value

    let parentElement = input.parentElement
    parentElement.classList.remove('was-validated');

    if (inputVal == '') {
        input.setCustomValidity('Hiba! Ne hagyd üresen légyszi!');
        parentElement.classList.add('was-validated');
        document.querySelector('div.invalid-feedback').innerHTML = 'Ne hagyd üresen légyszi! '
        table.classList.add('d-none')
    } else {
        const filter = document.querySelector('input[name="filter"]:checked')
        // console.log(filter.value);
        let optional = filter ? `&${filter.value}=1` : ''

        fetch(`${endpoint}/?q=${inputVal}${optional}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.data.length == 0) {
                    table.classList.add('d-none')
                    tableBody.innerHTML = ''
                    parentElement.classList.add('was-validated');
                    document.querySelector('div.invalid-feedback').innerHTML = 'Sorry, the submitted license plate is not valid'
                } else {
                    table.classList.remove('d-none')
                    console.log(data)
                    data.data.forEach(auto => {
                        tableBody.innerHTML += `<tr>
               <td>${auto.license}</td>
            <td class="brand" onclick="searchByBrand(this)">${auto.brand}</td>
               <td>${auto.model}</td>
               <td>${auto.color}</td>
               <td>${auto.year}</td>
           </tr>`
                    })
                }
            })
            .catch(error => console.error(error.message))
    }
    // inputVal = ""
    regForm.reset()
    radioValue = ""
})

let table = document.querySelector('.table')
const brands = document.querySelectorAll('.brand')

function searchByBrand(that) {
    tableBody.innerHTML = ''

    fetch(`${endpoint}/${that.textContent}`)
        .then((response) => response.json())
        .then((data) => {
            //  table.classList.remove('d-none')
            console.log(data)
            data.data.forEach(auto => {
                tableBody.innerHTML += `<tr>
           <td>${auto.license}</td>
           <td class="brand">${auto.brand}</td>
           <td>${auto.model}</td>
           <td>${auto.color}</td>
           <td>${auto.year}</td>
       </tr>`
            })
        })
        .catch(error => console.error(error.message))
}