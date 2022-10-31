import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

const licensePlates = [
    {
        "license": "HMZ-140",
        "brand": "Audi",
        "model": "A8",
        "year": 2016,
        "color": "red"
    },
    {
        "license": "HMZ-555",
        "brand": "BMZ",
        "model": "Z4",
        "year": 2011,
        "color": "pink"
    },
    {
        "license": "DEL-555",
        "brand": "BMZ",
        "model": "Z4",
        "year": 2011,
        "color": "pink"
    },
    {
        "license": "ABC-123",
        "brand": "Audi",
        "model": "Z4",
        "year": 2011,
        "color": "pink"
    },
    {
        "license": "RB12-51",
        "brand": "Opel",
        "model": "Z4",
        "year": 2011,
        "color": "pink"
    },
    {
        "license": "FAVAG-0",
        "brand": "Opel",
        "model": "Z4",
        "year": 2011,
        "color": "pink"
    },
    {
        "license": "DT11-55",
        "brand": "Opel",
        "model": "Z4",
        "year": 2011,
        "color": "pink"
    }
];

app.use(cors());

app.get('/search', (req, res) => {
    const requestedPlate = req.query.q;
    let filteredPlates = [];
    // const policeRequest = req.query.police;
    // const diplomaticRequest = req.query.diplomat;

    // if (policeRequest) {
    if (req.query.filter == 'police') {
        for (let licensePlate of licensePlates) {
            if (licensePlate.license.includes(requestedPlate) && licensePlate.license.startsWith('RB')) {
                filteredPlates.push(licensePlate);
            }
        }
        // } else if (diplomaticRequest) {
    } else if (req.query.filter == 'diplomat') {
        for (let licensePlate of licensePlates) {
            if (licensePlate.license.includes(requestedPlate) && licensePlate.license.startsWith('DT')) {
                filteredPlates.push(licensePlate);
            }
        }
    } else {
        for (let licensePlate of licensePlates) {
            if (licensePlate.license.includes(requestedPlate)) {
                filteredPlates.push(licensePlate);
            }
        }
    }
    res.send({
        "result": "ok",
        "data": filteredPlates
    })

})
app.get('/search/:brand', (req, res) => {
    const requestedBrand = req.params.brand
    console.log(requestedBrand);
    let filteredPlates = [];
    for (let licensePlate of licensePlates) {
        if (licensePlate.brand === requestedBrand) {
            filteredPlates.push(licensePlate);
        }
    }
    res.send({
        "result": "ok",
        "data": filteredPlates
    })
})

app.listen(port, () => {
    console.log(`Server listens on port ${port}.`);
})