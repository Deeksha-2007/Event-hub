
const { PrismaClient } = require("@prisma/client");
const { randomUUID } = require("crypto");
require("dotenv").config();

const prisma = new PrismaClient();

const venues = [
  {
    name: "Bharat Mandapam",
    address: "Pragati Maidan, Mathura Road",
    city: "New Delhi",
    state: "Delhi",
    capacity: 7000,
    amenities: "WiFi, Parking, Food Court, AC, Accessibility",
  },
  {
    name: "Yashobhoomi Convention Centre",
    address: "Sector 25, Dwarka",
    city: "New Delhi",
    state: "Delhi",
    capacity: 5000,
    amenities: "WiFi, Parking, AC, Food Court",
  },
  {
    name: "India Expo Centre",
    address: "Plot 23-25, Knowledge Park II",
    city: "Greater Noida",
    state: "Uttar Pradesh",
    capacity: 4000,
    amenities: "WiFi, Parking, Exhibition Halls, Food Court",
  },
  {
    name: "The Leela Ambience Convention Hotel",
    address: "1 CBD, Maharaja Surajmal Road",
    city: "New Delhi",
    state: "Delhi",
    capacity: 2500,
    amenities: "WiFi, Parking, Catering, AC",
  },
  {
    name: "Kingdom of Dreams",
    address: "Sector 29",
    city: "Gurugram",
    state: "Haryana",
    capacity: 2000,
    amenities: "Parking, Food Court, Stage, Sound System",
  },
  {
    name: "Jio World Convention Centre",
    address: "G Block, Bandra Kurla Complex",
    city: "Mumbai",
    state: "Maharashtra",
    capacity: 5000,
    amenities: "WiFi, Parking, AC, Exhibition Halls",
  },
  {
    name: "NESCO Exhibition Centre",
    address: "Western Express Highway, Goregaon East",
    city: "Mumbai",
    state: "Maharashtra",
    capacity: 3500,
    amenities: "Parking, WiFi, Food Court, Exhibition Halls",
  },
  {
    name: "Bangalore International Exhibition Centre",
    address: "10th Mile, Tumkur Road",
    city: "Bengaluru",
    state: "Karnataka",
    capacity: 4000,
    amenities: "Parking, WiFi, Food Court, Exhibition Halls",
  },
  {
    name: "The Lalit Ashok",
    address: "Kumara Krupa High Grounds",
    city: "Bengaluru",
    state: "Karnataka",
    capacity: 1500,
    amenities: "WiFi, Parking, Catering, Conference Rooms",
  },
  {
    name: "Chennai Trade Centre",
    address: "Nandambakkam",
    city: "Chennai",
    state: "Tamil Nadu",
    capacity: 3000,
    amenities: "Parking, WiFi, Exhibition Halls, Food Court",
  },
  {
    name: "HITEX Exhibition Centre",
    address: "Izzatnagar, Madhapur",
    city: "Hyderabad",
    state: "Telangana",
    capacity: 3500,
    amenities: "Parking, WiFi, AC, Exhibition Halls",
  },
  {
    name: "Biswa Bangla Convention Centre",
    address: "New Town",
    city: "Kolkata",
    state: "West Bengal",
    capacity: 2500,
    amenities: "WiFi, Parking, AC, Conference Rooms",
  },
];

async function main() {
  console.log("Starting venue seeding...");

  for (const venueData of venues) {
    const existingVenue = await prisma.venue.findFirst({
      where: {
        name: venueData.name,
        city: venueData.city,
      },
    });

    const data = {
      ...venueData,
      country: "India",
      updatedAt: new Date(),
    };

    if (existingVenue) {
      await prisma.venue.update({
        where: { id: existingVenue.id },
        data,
      });

      console.log(`Updated venue: ${venueData.name}`);
    } else {
      await prisma.venue.create({
        data: {
          id: randomUUID(),
          ...data,
          createdAt: new Date(),
        },
      });

      console.log(`Created venue: ${venueData.name}`);
    }
  }

  console.log(`\nSuccessfully processed ${venues.length} venues.`);
}

main()
  .catch((error) => {
    console.error("Venue seed error:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
