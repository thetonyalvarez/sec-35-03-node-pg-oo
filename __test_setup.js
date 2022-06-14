process.env.NODE_ENV = "test";

const db = require("./db");

async function setUp() {
	await db.query(`
		DELETE FROM reservations;
		DELETE FROM customers;

		SELECT setval('customers_id_seq', 1, false);
		SELECT setval('reservations_id_seq', 1, false);

		INSERT INTO customers (first_name, last_name, phone, notes)
			VALUES
			('Anthony', 'Gonzales', '590-813-4874x723', 'Money voice rate chair war subject kid.'),
			('Joseph', 'Wells', '', 'Else quite deal culture deep candidate exactly.'),
			('Crystal', 'Coleman', '', '');

		INSERT INTO reservations (customer_id, start_at, num_guests, notes)
			VALUES
			(1, '2018-09-08 12:20:07-07', 2, 'Decade college home heart.'),
			(2, '2018-06-18 19:31:59-07', 5, ''),
			(3, '2018-09-21 14:24:33-07', 5, ''),
			(1, '2019-10-21 12:24:33-07', 3, '');
	`);

}

module.exports = { setUp };
