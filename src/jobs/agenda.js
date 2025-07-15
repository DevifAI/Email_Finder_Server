// jobs/agenda.js
const { Agenda } = require("agenda");
const mongoConnectionString = process.env.MONGO_URI;
console.log("ffffttyf");

const agenda = new Agenda({ db: { address: mongoConnectionString } });

module.exports = agenda;
