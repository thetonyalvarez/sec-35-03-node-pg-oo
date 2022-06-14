/* It's setting up the environment for the test. */
// connect to right DB --- set before loading db.js
process.env.NODE_ENV = "test";

// npm packages
const request = require("supertest");

// app imports
const app = require("../app");
const db = require("../db");
const { setUp } = require("../__test_setup");

const Reservation = require("../models/reservation");

beforeEach(setUp);

describe('Reservations Model', () => {
    it("should get Reservations for customer", async () => {
        const reservations = await Reservation.getReservationsForCustomer(1);
		expect(reservations.length).toEqual(2)
		expect(reservations[0].notes).toEqual('Decade college home heart.')
    });
	it("should save new reservation", async () => {
		const reservation = new Reservation({
			customerId: 1,
			numGuests: 4,
			startAt: new Date(),
			notes: 'test_notes'
		});

		await reservation.save();

		const resp = await Reservation.getReservationsForCustomer(1);
		expect(resp[2].notes).toEqual('test_notes')
	});
	it("should update existing reservation", async () => {
		const all_reservations = await Reservation.getReservationsForCustomer(1);
		const test_res = all_reservations[1];
		
		test_res.numGuests = 10;
		
		await test_res.save();
		
		const resp = await Reservation.getReservationsForCustomer(1);
		expect(resp[1].numGuests).toEqual(10)
		expect(resp[1].numGuests).not.toEqual(3)
	})
})

afterAll(async function () {
	// close db connection
	await db.end();
});
