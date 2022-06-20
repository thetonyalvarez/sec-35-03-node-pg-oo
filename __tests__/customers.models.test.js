/* It's setting up the environment for the test. */
// connect to right DB --- set before loading db.js
process.env.NODE_ENV = "test";

// npm packages
const request = require("supertest");

// app imports
const app = require("../app");
const db = require("../db");
const { setUp, addTenNewRecords } = require("../__test_setup");

const Customer = require("../models/customer");

beforeEach(setUp);

describe('Customer Model', () => {
	it("should show all customers", async () => {
		const customers = await Customer.all();
		expect(customers.length).toEqual(3)
	})
	it("should show customer by id", async () => {
		const customers = await Customer.get(1);
		expect(customers.firstName).toEqual('Anthony')
	})
	it("should show error if no id found", async () => {
		try {
			const resp = await Customer.get(9999);
			expect(resp.status).toEqual(404)
		} catch (err) {
			expect(err).toEqual(err);
		}
	})
	it("should return full name concatenated together", async () => {
		const resp = await Customer.get(1);
		expect(resp.fullName).toEqual('Anthony Gonzales')
		
	})
	it("should get reservations for a customer", async () => {
		const customer = await Customer.get(1);
		const resp = await customer.getReservations(1);
		expect(resp[0].notes).toEqual('Decade college home heart.')
	})
	it("should save new customer", async () => {
		const customer = new Customer({
			firstName: 'test_firstName',
			lastName: 'test_lastName',
			phone: 'test_phone',
			notes: 'test_notes'
		});
		await customer.save();

		const resp = await Customer.get(4);
		expect(resp.firstName).toEqual('test_firstName')
	})
	it("should update existing customer", async () => {
		const customer = await Customer.get(3);
		customer.firstName = 'edited_firstName';
		await customer.save();

		const resp = await Customer.get(3);
		expect(resp.firstName).toEqual('edited_firstName')
	});
	it("should search for customer", async () => {
		const query = {q: 'anthony'}
		const resp = await Customer.search(query)

		expect(resp[0].lastName).toEqual('Gonzales')
	});
	it("should return message if no results found in search", async () => {
		try {
			const query = {q: 'nothing'}
			await Customer.search(query)
		} catch (err) {
			expect(err).toEqual(err);
		}
	});
	it("should return top 10 customers by number of reservations", async () => {
		addTenNewRecords();
		const resp = await Customer.topTen()
		expect(resp[0].firstName).toEqual('FName5')
		expect(resp[2].firstName).toEqual('Crystal')
		expect(resp[10]).toBeUndefined()
	});
	it("should return all customers if there are not at least 10", async () => {
		const resp = await Customer.topTen()
		expect(resp[0].firstName).toEqual('Anthony')
		expect(resp[2].firstName).toEqual('Joseph')
		expect(resp[9]).toBeUndefined()
	})
	it("should show notes using getter", async () => {
		const resp = await Customer.get(1);

		expect(resp.notes).toContain('Money')
	});
	it("should update notes using setter", async () => {
		const resp = await Customer.get(1);
		
		resp.notes = 'updated notes';
		
		expect(resp.notes).toEqual('updated notes')
	});
	it("should assign empty string if notes is falsey value", async () => {
		const resp = await Customer.get(1);

		resp.notes = false;

		expect(resp.notes).toEqual('')
	});
})

afterAll(async function () {
	// close db connection
	await db.end();
});
