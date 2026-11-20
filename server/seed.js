// Seed script — populates the database with sample admin, users, and events
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

dotenv.config();

const users = [
    { name: 'Admin User',   email: 'admin@eventhub.com', password: 'password123', role: 'admin' },
    { name: 'Demo User',    email: 'user@eventhub.com',  password: 'password123', role: 'user' },
    { name: 'Alice Smith',  email: 'alice@eventhub.com', password: 'password123', role: 'user' },
    { name: 'Bob Johnson',  email: 'bob@eventhub.com',   password: 'password123', role: 'user' },
];

const events = [
    {
        title: 'React & Node.js Developer Retreat',
        description: 'A 3-day deep dive into modern full-stack web development. Perfect for developers looking to level up.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: 'Silicon Valley Innovation Center, CA',
        category: 'Technology',
        totalSeats: 100,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Neon Nights Music Festival',
        description: 'An unforgettable night of live music with top artists from around the globe.',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: 'Grand Arena, New York',
        category: 'Music',
        totalSeats: 500,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Global Leaders Business Summit',
        description: 'Network with top executives and business leaders to discuss innovation and leadership.',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        location: 'Marriott Grand Ballroom, Chicago',
        category: 'Business',
        totalSeats: 200,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Photography & Art Exhibition',
        description: 'An exhibition showcasing the works of local photographers and digital artists.',
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        location: 'City Art Gallery, San Francisco',
        category: 'Arts',
        totalSeats: 150,
        image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'College Sports Day 2024',
        description: 'Annual inter-college sports competition covering cricket, football, basketball and more.',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        location: 'City Sports Complex, Pune',
        category: 'Sports',
        totalSeats: 300,
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800'
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('\n✅ MongoDB connected...');

        // Clear existing data
        await User.deleteMany();
        await Event.deleteMany();
        await Booking.deleteMany();
        console.log('🗑️  Cleared existing data.');

        // Hash passwords and create users
        const salt = await bcrypt.genSalt(10);
        const hashedUsers = users.map(u => ({
            ...u,
            password: bcrypt.hashSync(u.password, salt)
        }));
        const createdUsers = await User.insertMany(hashedUsers);
        const adminUser = createdUsers.find(u => u.role === 'admin');
        const normalUsers = createdUsers.filter(u => u.role === 'user');
        console.log(`👤 Created ${createdUsers.length} users.`);

        // Create events linked to admin
        const eventsWithAdmin = events.map(e => ({
            ...e,
            availableSeats: e.totalSeats,
            createdBy: adminUser._id
        }));
        const createdEvents = await Event.insertMany(eventsWithAdmin);
        console.log(`🎉 Created ${createdEvents.length} events.`);

        // Create some sample bookings
        const bookingsData = [];
        for (const event of createdEvents) {
            for (const user of normalUsers.slice(0, 2)) {
                bookingsData.push({
                    userId: user._id,
                    eventId: event._id,
                    status: 'confirmed'
                });
                event.availableSeats -= 1;
                await event.save();
            }
        }
        await Booking.insertMany(bookingsData);
        console.log(`🎫 Created ${bookingsData.length} sample bookings.`);

        console.log('\n🚀 Database seeded successfully!');
        console.log('-------------------------------------------');
        console.log('Admin:   admin@eventhub.com / password123');
        console.log('User:    user@eventhub.com  / password123');
        console.log('-------------------------------------------\n');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedDatabase();
