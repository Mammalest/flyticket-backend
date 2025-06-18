import mongoose from 'mongoose';
import Flight from './models/Flight.js';
import City from './models/City.js';
import Admin from './models/Admin.js';
import Ticket from './models/Ticket.js';

const MONGO_URI = 'mongodb://localhost:27017/flyticket';

const flights = [
  {
    from: 'İstanbul',
    to: 'İzmir',
    departure_time: new Date('2025-06-01T10:00:00Z'),
    arrival_time: new Date('2025-06-01T11:15:00Z'),
    price: 500,
    seats_total: 200,
    seats_available: 120
  },
  {
    from: 'İzmir',
    to: 'Antalya',
    departure_time: new Date('2025-06-01T12:00:00Z'),
    arrival_time: new Date('2025-06-01T13:30:00Z'),
    price: 750,
    seats_total: 220,
    seats_available: 180
  },
  {
    from: 'Antalya',
    to: 'Ankara',
    departure_time: new Date('2025-06-01T14:00:00Z'),
    arrival_time: new Date('2025-06-01T15:45:00Z'),
    price: 150,
    seats_total: 180,
    seats_available: 140
  },
  {
    from: 'Ankara',
    to: 'İstanbul',
    departure_time: new Date('2025-06-02T08:00:00Z'),
    arrival_time: new Date('2025-06-02T09:20:00Z'),
    price: 320,
    seats_total: 150,
    seats_available: 150
  },
  {
    from: 'İstanbul',
    to: 'Antalya',
    departure_time: new Date('2025-06-02T10:00:00Z'),
    arrival_time: new Date('2025-06-02T11:45:00Z'),
    price: 650,
    seats_total: 200,
    seats_available: 190
  },
  {
    from: 'İzmir',
    to: 'Ankara',
    departure_time: new Date('2025-06-02T13:00:00Z'),
    arrival_time: new Date('2025-06-02T14:40:00Z'),
    price: 480,
    seats_total: 180,
    seats_available: 170
  },
  {
    from: 'Antalya',
    to: 'İzmir',
    departure_time: new Date('2025-06-03T09:00:00Z'),
    arrival_time: new Date('2025-06-03T10:30:00Z'),
    price: 700,
    seats_total: 160,
    seats_available: 140
  },
  {
    from: 'Ankara',
    to: 'İzmir',
    departure_time: new Date('2025-06-03T12:00:00Z'),
    arrival_time: new Date('2025-06-03T13:40:00Z'),
    price: 530,
    seats_total: 160,
    seats_available: 150
  },
  {
    from: 'İstanbul',
    to: 'Ankara',
    departure_time: new Date('2025-06-03T15:00:00Z'),
    arrival_time: new Date('2025-06-03T16:20:00Z'),
    price: 400,
    seats_total: 200,
    seats_available: 180
  },
  {
    from: 'Antalya',
    to: 'İstanbul',
    departure_time: new Date('2025-06-04T08:00:00Z'),
    arrival_time: new Date('2025-06-04T09:45:00Z'),
    price: 600,
    seats_total: 180,
    seats_available: 170
  }
];


const cities = [
  { id: '01', name: 'Adana' }, { id: '02', name: 'Adıyaman' }, { id: '03', name: 'Afyonkarahisar' },
  { id: '04', name: 'Ağrı' }, { id: '05', name: 'Amasya' }, { id: '06', name: 'Ankara' },
  { id: '07', name: 'Antalya' }, { id: '08', name: 'Artvin' }, { id: '09', name: 'Aydın' },
  { id: '10', name: 'Balıkesir' }, { id: '11', name: 'Bilecik' }, { id: '12', name: 'Bingöl' },
  { id: '13', name: 'Bitlis' }, { id: '14', name: 'Bolu' }, { id: '15', name: 'Burdur' },
  { id: '16', name: 'Bursa' }, { id: '17', name: 'Çanakkale' }, { id: '18', name: 'Çankırı' },
  { id: '19', name: 'Çorum' }, { id: '20', name: 'Denizli' }, { id: '21', name: 'Diyarbakır' },
  { id: '22', name: 'Edirne' }, { id: '23', name: 'Elazığ' }, { id: '24', name: 'Erzincan' },
  { id: '25', name: 'Erzurum' }, { id: '26', name: 'Eskişehir' }, { id: '27', name: 'Gaziantep' },
  { id: '28', name: 'Giresun' }, { id: '29', name: 'Gümüşhane' }, { id: '30', name: 'Hakkari' },
  { id: '31', name: 'Hatay' }, { id: '32', name: 'Isparta' }, { id: '33', name: 'Mersin' },
  { id: '34', name: 'İstanbul' }, { id: '35', name: 'İzmir' }, { id: '36', name: 'Kars' },
  { id: '37', name: 'Kastamonu' }, { id: '38', name: 'Kayseri' }, { id: '39', name: 'Kırklareli' },
  { id: '40', name: 'Kırşehir' }, { id: '41', name: 'Kocaeli' }, { id: '42', name: 'Konya' },
  { id: '43', name: 'Kütahya' }, { id: '44', name: 'Malatya' }, { id: '45', name: 'Manisa' },
  { id: '46', name: 'Kahramanmaraş' }, { id: '47', name: 'Mardin' }, { id: '48', name: 'Muğla' },
  { id: '49', name: 'Muş' }, { id: '50', name: 'Nevşehir' }, { id: '51', name: 'Niğde' },
  { id: '52', name: 'Ordu' }, { id: '53', name: 'Rize' }, { id: '54', name: 'Sakarya' },
  { id: '55', name: 'Samsun' }, { id: '56', name: 'Siirt' }, { id: '57', name: 'Sinop' },
  { id: '58', name: 'Sivas' }, { id: '59', name: 'Tekirdağ' }, { id: '60', name: 'Tokat' },
  { id: '61', name: 'Trabzon' }, { id: '62', name: 'Tunceli' }, { id: '63', name: 'Şanlıurfa' },
  { id: '64', name: 'Uşak' }, { id: '65', name: 'Van' }, { id: '66', name: 'Yozgat' },
  { id: '67', name: 'Zonguldak' }, { id: '68', name: 'Aksaray' }, { id: '69', name: 'Bayburt' },
  { id: '70', name: 'Karaman' }, { id: '71', name: 'Kırıkkale' }, { id: '72', name: 'Batman' },
  { id: '73', name: 'Şırnak' }, { id: '74', name: 'Bartın' }, { id: '75', name: 'Ardahan' },
  { id: '76', name: 'Iğdır' }, { id: '77', name: 'Yalova' }, { id: '78', name: 'Karabük' },
  { id: '79', name: 'Kilis' }, { id: '80', name: 'Osmaniye' }, { id: '81', name: 'Düzce' }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Flight.deleteMany({});
    await City.deleteMany({});
    await Admin.deleteMany({});
    console.log('Cleared existing data');

    // Insert cities first
    const insertedCities = await City.insertMany(cities);
    console.log('Inserted cities');

    // Create a map from city name to _id
    const cityMap = new Map();
    insertedCities.forEach(city => cityMap.set(city.name, city._id));

    // Replace city names with ObjectIds in flights
    const flightsss = flights.map(flight => {
      const fromId = cityMap.get(flight.from);
      const toId = cityMap.get(flight.to);

      if (!fromId || !toId) {
        throw new Error(`City not found for flight: from=${flight.from} to=${flight.to}`);
      }

      return {
        ...flight,
        from: fromId,
        to: toId
      };
    });

    // Insert flights
    await Flight.insertMany(flightsss);
    console.log('Inserted flights');

    // Insert flights
const insertedFlights = await Flight.insertMany(flightsss);
console.log('Inserted flights');

// Prepare tickets, link to inserted flight IDs
const ticketsToInsert = [
  {
    passenger_name: 'John',
    passenger_surname: 'Doe',
    passenger_email: 'john.doe@example.com',
    flight_id: insertedFlights[0]._id,
  },
  {
    passenger_name: 'Jane',
    passenger_surname: 'Smith',
    passenger_email: 'jane.smith@example.com',
    flight_id: insertedFlights[1]._id,
  },
  {
    passenger_name: 'Alice',
    passenger_surname: 'Johnson',
    passenger_email: 'alice.johnson@example.com',
    flight_id: insertedFlights[0]._id,
  }
];

await Ticket.insertMany(ticketsToInsert);
console.log('Inserted tickets');



    const admin = new Admin({
      username: 'sero',
      password: '123', // In real apps, hash this
    });

    // Insert Admin Creds
    await Admin.insertOne(admin);
    console.log('Admin Set');


    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error:', err);
  }
}

seed();
