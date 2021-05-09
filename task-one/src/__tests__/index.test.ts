const request = require('supertest');

let app = require('../index');

let dataFiles = require("../database/database.json");

// beforeEach(() => {
//   app = require("../index");
// });

afterEach(() => {
  app.close();
});
describe('GET /dataFiles', () => {

  test("respond with json containing a list of all dataFiles", function (done) {
    request(app)
      .get("/dataFiles")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  test("GET /dataFiles/:id respond with a single dataFile", function (done) {
    request(app)
      .get("/dataFiles/1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});

describe("POST /dataFiles", () => {
  let data = {
    organization: "organization",
    products: "products",
    marketValue: "90%",
    address: "sangotedo",
    ceo: "cn",
  };
  it("respond with 201 created", (done) => {
    request(app)
      .post("/dataFiles")
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200,done)
  });
});


describe("PUT /dataFiles/:id", () => {
  let data = {
    address: "lalaland",
    ceo: "only one!",
  };
  test("Responds with a single dataFile", function (done) {
    request(app)
      .put("/dataFiles/" + dataFiles[dataFiles.length - 1].id)
      .send(data)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done)
  });
});

describe("DELETE /dataFiles/:id", () => {
  test("Return status 200 after DELETING a dataFile", function (done) {
    request(app)
      .delete(`/dataFiles/${parseInt(dataFiles[dataFiles.length - 1].id)}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done)
  });
});

