/** Customer for Lunchly */

const db = require("../db");
const Reservation = require("./reservation");

/** Customer of the restaurant. */

class Customer {
  constructor({ id, firstName, lastName, phone, notes }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.notes = notes;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
  
  get notes() {
    return this._notes;
  }

  set notes(value) {
    if (value === false) {
      value = '';
      this._notes = value;
    }
    this._notes = value;
  }

  /** find all customers. */

  static async all() {
    const results = await db.query(
      `SELECT id, 
        first_name AS "firstName",  
        last_name AS "lastName", 
        phone, 
        notes
       FROM customers
       ORDER BY last_name, first_name`
    );
    return results.rows.map(c => new Customer(c));
  }

  /** search for customer */
  static async search(query_text) {
    const results = await db.query(`
      SELECT id, 
      first_name AS "firstName",  
      last_name AS "lastName", 
      phone, 
      notes
      FROM customers
      WHERE first_name ILIKE '%' || $1 || '%'
      OR last_name ILIKE '%' || $1 || '%'
    `, [query_text.q])

    if (results === undefined) {
      const err = new Error(`No customers found for ${query_text.q}`);
      err.status = 404;
      throw err;
    }

    return results.rows.map(c => new Customer(c));
  }

  /** get a customer by ID. */

  static async get(id) {
    const results = await db.query(
      `SELECT id, 
         first_name AS "firstName",  
         last_name AS "lastName", 
         phone, 
         notes 
        FROM customers WHERE id = $1`,
      [id]
    );

    const customer = results.rows[0];

    if (customer === undefined) {
      const err = new Error(`No such customer: ${id}`);
      err.status = 404;
      throw err;
    }

    return new Customer(customer);
  }

  /** get top 10 customers */
  static async topTen() {
    const results = await db.query(`
      SELECT
        customers.first_name AS "firstName",  
        customers.last_name AS "lastName", 
        customers.phone AS "phone", 
        customers.notes AS "notes",
        COUNT(customer_id) total_reservations
      FROM reservations
      INNER JOIN customers
      ON reservations.customer_id = customers.id
      GROUP BY first_name, last_name, phone, customers.notes, customer_id
      ORDER BY COUNT(customer_id) desc
      LIMIT 10
    `)

    if (results.rows[0] === undefined) {
      const err = new Error(`No such customer: ${id}`);
      err.status = 404;
      throw err;
    }

    return results.rows.map(c => new Customer(c));
  }

  /** get all reservations for this customer. */

  async getReservations() {
    return await Reservation.getReservationsForCustomer(this.id);
  }

  /** save this customer. */

  async save() {
    if (this.id === undefined) {
      const result = await db.query(
        `INSERT INTO customers (first_name, last_name, phone, notes)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
        [this.firstName, this.lastName, this.phone, this.notes]
      );
      this.id = result.rows[0].id;
    } else {
      await db.query(
        `UPDATE customers SET first_name=$1, last_name=$2, phone=$3, notes=$4
             WHERE id=$5`,
        [this.firstName, this.lastName, this.phone, this.notes, this.id]
      );
    }
  }

}

module.exports = Customer;
