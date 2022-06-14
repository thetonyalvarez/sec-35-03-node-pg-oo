const routes = require("../routes");

const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);

describe("GET /", () => {
    it("homepage route works", done => {
        request(app)
            .get("/")
            .expect(200, done);
    });
})