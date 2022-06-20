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
			startAt: new Date('September 20, 2020 11:13:00'),
			notes: 'test_notes'
		});

		await reservation.save();

		const resp = await Reservation.getReservationsForCustomer(1);
		expect(resp[2].notes).toEqual('test_notes')
	});
	it("should show notes using getter", async () => {
		const all_reservations = await Reservation.getReservationsForCustomer(1);
		const test_res = all_reservations[0];

		expect(test_res.notes).toContain('Decade')
	});
	it("should update notes using setter", async () => {
		const all_reservations = await Reservation.getReservationsForCustomer(1);
		const test_res = all_reservations[0];
		
		test_res.notes = 'updated notes';
		
		expect(test_res.notes).toEqual('updated notes')
	});
	it("should assign empty string if notes is falsey value", async () => {
		const all_reservations = await Reservation.getReservationsForCustomer(1);
		const test_res = all_reservations[0];

		test_res.notes = false;

		expect(test_res.notes).toEqual('') 	
	});
	it("should show numGuests using getter", async () => {
		const all_reservations = await Reservation.getReservationsForCustomer(1);
		const test_res = all_reservations[1];
		
		expect(test_res.numGuests).toEqual(3)
	});
	it("should update numGuests using setter", async () => {
		const all_reservations = await Reservation.getReservationsForCustomer(1);
		const test_res = all_reservations[1];
		
		test_res.numGuests = 10;
		
		expect(test_res.numGuests).toEqual(10)
	});
	it("should throw error if numGuests is less than 1", async () => {
		const all_reservations = await Reservation.getReservationsForCustomer(1);
		const test_res = all_reservations[1];

		try {
			test_res.numGuests = 0;
		} catch (err) {
			expect(err).toEqual(err);
		}
	});
	it("should show Date using getter", async () => {
		const all_reservations = await Reservation.getReservationsForCustomer(1);
		const test_res = all_reservations[0];

		expect(test_res.startAt instanceof Date).toEqual(true)
	});
	it("should update Date using setter", async () => {
		const all_reservations = await Reservation.getReservationsForCustomer(1);
		const test_res = all_reservations[0];

		const newDate = new Date('December 20, 2020 11:13:00');

		test_res.startAt = newDate;

		expect(test_res.startAt).toEqual(newDate)
	});
	it("should throw error if Date is not of Date type", async () => {
		const all_reservations = await Reservation.getReservationsForCustomer(1);
		const test_res = all_reservations[1];

		try {
			test_res.startAt = 'not a date';
		} catch (err) {
			expect(err).toEqual(err);
		}
	});
	it("should show customer_id on reservation using getter", async () => {
		const all_reservations = await Reservation.getReservationsForCustomer(1);
		const test_res = all_reservations[1];

		expect(test_res.customerId).toEqual(1)
	});
	it("should throw error if customer_id tries to be updated on a reservation", async () => {
		const newReservation = new Reservation({
			numGuests: 9,
			startAt: new Date('November 20, 2020 11:13:00'),
			notes: 'test_notes_new_reservation'
		});

		newReservation.customerId = 1;

		try {
			newReservation.customerId = 2;
		} catch (err) {
			expect(err).toEqual(err)
		}

	});
})

afterAll(async function () {
	// close db connection
	await db.end();
});
