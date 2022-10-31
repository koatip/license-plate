'use strict';

const endpoint = 'http://localhost:5000/search';
const search = document.querySelector('#search')
const tableContainer = document.querySelector('#table-container')

document.querySelector('button').addEventListener('click', doSearch);

async function doSearch() {
  const filter = document.querySelector('input[name="filter"]:checked').value;
  const response = await fetch(`${endpoint}?q=${search.value}&${filter}=1`);
  const json = await response.json();
  if (json.result === "error") {
    tableContainer.innerHTML = 'Sorry, the submitted license plate is not valid';
  } else {
    const cars = json.data;
    showTable(cars);
  }
}

async function getBrand(element) {
  const brand = element.innerText
  const response = await fetch(`${endpoint}/${brand}`);
  const json = await response.json();
  const cars = json.data;
  showTable(cars);
}

function showTable(cars) {
  tableContainer.innerHTML = `
      <table class="table table-bordered">
      <thead>
        <tr>
          <th scope="col">License plate</th>
          <th scope="col">Brand</th>
          <th scope="col">Model</th>
          <th scope="col">Color</th>
          <th scope="col">Year</th>
        </tr>
      </thead>
      <tbody>
        ${cars.map(car => `
            <tr>
              <td>${car.license}</td>
              <td onclick="getBrand(this)">${car.brand}</td>
              <td>${car.model}</td>
              <td>${car.color}</td>
              <td>${car.year}</td>
            </tr>
          `).join('')
    }
      </tbody>
    </table>
  `
}
