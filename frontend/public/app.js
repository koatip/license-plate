'use strict';

const searchEndpoint = 'http://localhost:5000/search';

const searchForm = document.getElementById('search-form');

document.getElementById('license-plate').addEventListener('input', (event) => {  //ha többféle hibaüzenet kell, akkor azt itt a js-ben írjuk meg
    event.preventDefault();
    const inputElement = event.target;
    const parentElement = inputElement.parentElement;
    const errorMessageContent = parentElement.querySelector('.invalid-feedback');

    const regex = /^[A-Z0-9-]+$/;

    if (regex.test(inputElement.value)) {  //regex test metódusának átadjuk az input értékét. Boolean-nel tér vissza. Regex-hez beépített dolog. Leellenőrizzük, h megfelel-e az input a követelményeknek
        //happy path  //ha megfelel a formátumnak
        console.log('megfelelő a formátum');
        inputElement.setCustomValidity("");
        errorMessageContent.textContent = "";
        parentElement.classList.remove('was-validated');
    } else {                                                   //nem felel meg a regex követelményeinek
        inputElement.setCustomValidity("Sorry, the submitted license plate is not valid");
        errorMessageContent.textContent = inputElement.validationMessage;    //módosítjuk az invalid feedback szövegét arra , amit a fenti sorban megadtuk a setcostumvalidity-vel
        parentElement.classList.add('was-validated');
    }
})


searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.target;
    // if (document.getElementById('license-plate').textContent == '') {
    //     document.getElementById('license-plate').parentElement.querySelector('.invald-feedback').textContent = 'Nem maradhat üresen a mező!'
    // }
    if (form.checkValidity()) {  // ez true vagy false lesz // összes inputon végigfut és ellenőrzi, h jó-e
        //happy path
        form.classList.remove('was-validated');

        const formData = new FormData(form); //ez még nem túl olvasható osztályból származó object, de ennek sok propertyje van, ami nek kell, így át kell formálni, h normál object legyen
        const data = Object.fromEntries(formData.entries()); //így olvasható object lesz
        console.log(data);   //összes adatot, amit kaptunk a formból megkapjuk name-value, kulcs-érték párokként. Nem kell egyesével kiszedegetni, h minek mi a value-ja 
        // {q: 'HMZ-1234', filter: 'police'} ez a data, de nekünk nem úgy kell, h filter: 'police', hanem a query stringbe, majd az kell, h police=1


        const searchParamValues = {  //ide gyűjtjük az átalakított adatokat és ezt adjuk majd át az url-be query stringként összefűzve
            'q': data.q,
        }

        if (data.filter !== undefined) {
            searchParamValues[data.filter] = 1;
        }

        console.log(searchParamValues);  // ez az az object, amire igazán szükségünk van és a kulcs érték párjait query stringben elküldhetjük az url végén

        const queryParams = new URLSearchParams(searchParamValues); // az előbbi objectből fűz nekünk egy querystringet, de a toStriong kell még utána. Balázs a new FormData-ra tette a new URLSearchParams-ot stringgé alakítva és már jó is lett.
        console.log(queryParams.toString());   //q=DTE-511&police=1

        const url = searchEndpoint + '?' + queryParams.toString();

        fetch(url)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then(handleResponse)   //táblázatba mennek az adatok, amit a html-ben kezdünk megírni, thead még odamegy
            .catch(err => {   // kell egy error alert: alert-danger // form alá tettük a html-div-jét szöveg nélkül és ráteszünk egy display-none-t (d-none)
                const errorElement = document.getElementById("form-error");
                errorElement.textContent = err.message;
                errorElement.classList.remove('d-none');
            })

        // form kiürítés
        searchForm.reset();  //submit gombra kattintás után kiüríti a formot

    } else {
        //ezt én írtam hozzá-----------------------------------------------------------------------------------------------
        const tbody = document.querySelector('#search-results tbody');
        tbody.innerHTML = ''
        let input = document.getElementById('license-plate')
        if (input.value.length == 0) {
            let inputParent = input.parentElement
            // input.setCustomValidity("Ne hagyd üresen a beviteli mezőt!");
            inputParent.querySelector('.invalid-feedback').textContent = "Nem meradhat üres!"
            // errorMessageContent.textContent = inputElement.validationMessage;    //módosítjuk az invalid feedback szövegét arra , amit a fenti sorban megadtuk a setcostumvalidity-vel
            inputParent.classList.add('was-validated');

            searchForm.reset()

            form.classList.add('was-validated');
        }
        searchForm.reset()
        //eddig én írtam hozzá!---------------------------------------------------------------------------------------
        form.classList.add('was-validated');  //div.invalid-feedback így már látszik és már kiabál is h: nem maradhat üresen a mező, amihez, csak kellett az inputot magábaölelő div végére a a div.invalid-feedback és az inputba beírtuk, h required
    }
})

function handleResponse(data) {
    console.log(data)

    const queryResults = data.data;  //ez 1 tömb
    const tbody = document.querySelector('#search-results tbody');
    tbody.innerHTML = '';

    const queryTableMapping = ['license', 'brand', 'model', 'color', 'year'];

    // táblázat
    if (queryResults.length > 0) {
        queryResults.forEach((row) => {
            const rowElement = document.createElement('tr');

            queryTableMapping.forEach((key) => {
                const element = document.createElement('td');
                element.textContent = '';
                // <td>${key === 'brand' ?
                //     `<a href=#>row[key]</a>` :
                //     `row[key]`
                // }</td>
                if (row[key] !== undefined) {
                    if (key === 'brand') {
                        const brandLink = document.createElement('a');
                        brandLink.textContent = row[key];
                        brandLink.setAttribute('href', '#');  //ez azért kell, hogy látsszon, h ez egy link
                        brandLink.addEventListener('click', (event) => {
                            const brandUrl = searchEndpoint + '/' + event.target.textContent;  //itt az event.target textContentjét érdemesebb használni, mert ez lesz a legfrissebb
                            fetch(brandUrl)
                                .then(response => response.json())
                                .then(handleResponse);
                        });
                        element.appendChild(brandLink);
                    } else {
                        element.textContent = row[key];
                    }
                }
                rowElement.appendChild(element);
            })
            tbody.appendChild(rowElement);
        })
    }
}

// Hozzáadtam ezt a sort