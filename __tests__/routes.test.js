process.env.NODE_ENV = "test";

const request = require("supertest");
const bodyParser = require("body-parser");
const routes = require("../routes");

const app = require("../app");
const db = require("../db");
const { setUp } = require("../__test_setup");
const { tearDown } = require("../__test_tearDown");

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json())

app.use(routes);

beforeEach(setUp);
afterEach(tearDown);

describe("GET /", () => {
	it("should return homepage", () => {
		return request(app)
			.get("/")
			.then((response) => {
                expect(response.text).toContain('<title>Lunch.ly Customers</title>')
				expect(response.statusCode).toBe(200);
			});
	});
	it("should throw error if Customer cannot be fetched", async () => {
        await db.query(`
            DELETE FROM reservations;
            DELETE FROM customers;
            DROP TABLE reservations;
            DROP TABLE customers;
        `);
		return request(app)
        .get("/")
        .then((response) => {
            expect(() => response).toThrowError;
            expect(response.statusCode).toBe(500);
        });
	});
    // tearDown;
});

describe("GET /add", () => {
	it("should return customer new form", () => {
		return request(app)
			.get("/add")
			.then((response) => {
                expect(response.text).toContain('<title>Lunch.ly New Customer</title>')
				expect(response.statusCode).toBe(200);
			});
	});
});

describe("POST /add", () => {
	it("should add a new customer", async () => {
        const customer = {
            firstName: 'test_fName',
            lastName: 'test_lName',
            phone: 'test_phone',
            notes: 'test_notes'
        };
		const res = await request(app)
			.post('/add')
            .send(customer)
		// const res = await request(app)
		// 	.post('/add/')
        //     .field('firstName', customer.firstName)
        //     .field('lastName', customer.lastName)
        //     .field('phone', customer.phone)
        //     .field('notes', customer.notes)

        console.log(res.body)
			// .then((response) => {
            //     console.log(response)
            //     // expect(response.text).toContain('<title>Lunch.ly New Customer</title>')
			// 	// expect(response.statusCode).toBe(200);
			// });
	});
});


afterAll(async function () {
	// close db connection
	await db.end();
});