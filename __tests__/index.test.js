const request = require('supertest');

let app = require('../dist/app.js');


// afterEach(() => {
//   app.close();
// });

describe('GET /fetchData', () => {

    test("respond with json containing a list of all data", function (done) {
        request(app)
            .get("/fetchData")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(201, done);
    });
});

describe("POST /calculate", () => {
    let data = {
        "shape": "triangle",
        "dimension": {
            "a": 5,
            "b": 5,
            "c": 6
        }
    };

    let data2 = {
        "shape": "triang",
        "dimension": {
            "a": 5,
            "b": 5,
            "c": 6
        }
    };

    test("respond with 200 OK", (done) => {
        request(app)
            .post("/calculate")
            .send(data)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done)
    })
    
    test('respond with 400 bad response', function (done) {
        request(app)
            .post('/calculate')
            .send(data2)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(JSON.stringify(`The shape ${data2["shape"]} is not valid`))
            .expect(400, done)
    })
});