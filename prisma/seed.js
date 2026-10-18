// Database seed script for EventNest — Event & Ticket Management System
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = new PrismaClient();

const generateId = () => crypto.randomUUID();

async function main() {
  console.log('🌱 Starting EventNest database seeding...');

  // 1. Seed Users
  console.log('👤 Seeding users...');
  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('Password@123', salt);

  const usersData = [
    {
      id: 'usr_organizer_priya',
      name: 'Priya Sharma (EventNest Studios)',
      email: 'organizer@eventnest.com',
      passwordHash: defaultPasswordHash,
      role: 'ORGANIZER',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'usr_user_aarav',
      name: 'Aarav Mehta',
      email: 'user@eventnest.com',
      passwordHash: defaultPasswordHash,
      role: 'USER',
      phone: '+91 98111 22334',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'usr_admin_dev',
      name: 'Dev Administrator',
      email: 'admin@eventnest.com',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      phone: '+91 99000 11223',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'usr_user_neha',
      name: 'Neha Kapoor',
      email: 'neha@example.com',
      passwordHash: defaultPasswordHash,
      role: 'USER',
      phone: '+91 97222 33445',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const userMap = {};
  for (const user of usersData) {
    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        updatedAt: new Date(),
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        updatedAt: new Date(),
      },
    });
    userMap[user.email] = record.id;
  }
  console.log(`✅ Seeded ${Object.keys(userMap).length} users.`);

  // 2. Seed Venues
  console.log('🏛️ Seeding venues...');
  const venuesData = [
    {
      id: 'ven_blr_bic',
      name: 'Bangalore International Centre',
      address: '7, 4th Main Rd, Stage 2, Domlur',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560071',
      capacity: 1200,
      amenities: 'Auditorium, Seminar Halls, High-speed Wi-Fi, VIP Lounge, Rooftop Cafe',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ven_mum_opera',
      name: 'Royal Opera House',
      address: 'Mathew Rd, Charni Road East, Opera House, Girgaon',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400004',
      capacity: 850,
      amenities: 'Historic Grand Hall, Acoustic Architecture, Orchestra Pit, Valet Parking',
      imageUrl: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ven_gur_cyber',
      name: 'Cyber Hub Open Amphitheatre',
      address: 'DLF Cyber City, Phase 2, Sector 24',
      city: 'Gurugram',
      state: 'Haryana',
      country: 'India',
      postalCode: '122002',
      capacity: 1500,
      amenities: 'Open Air Stage, Digital Audio Rig, Food Court Access, Metro Connected',
      imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ven_del_ihc',
      name: 'India Habitat Centre',
      address: 'Lodhi Road, Near Airforce Bal Bharati School',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      postalCode: '110003',
      capacity: 900,
      amenities: 'Convention Centre, Visual Arts Gallery, Outdoor Plaza, Fine Dining',
      imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const venueMap = {};
  for (const venue of venuesData) {
    const existing = await prisma.venue.findFirst({ where: { name: venue.name } });
    if (existing) {
      const updated = await prisma.venue.update({
        where: { id: existing.id },
        data: {
          address: venue.address,
          city: venue.city,
          state: venue.state,
          capacity: venue.capacity,
          amenities: venue.amenities,
          imageUrl: venue.imageUrl,
          updatedAt: new Date(),
        },
      });
      venueMap[venue.name] = updated.id;
    } else {
      const created = await prisma.venue.create({
        data: {
          ...venue,
          updatedAt: new Date(),
        },
      });
      venueMap[venue.name] = created.id;
    }
  }
  console.log(`✅ Seeded ${Object.keys(venueMap).length} venues.`);

  // 3. Seed Events and Tickets
  console.log('🎟️ Seeding events and ticket tiers...');
  const organizerId = userMap['organizer@eventnest.com'];

  const eventsData = [
    {
      id: 'evt_ai_summit_2026',
      title: 'Global AI & NextGen Cloud Summit 2026',
      description:
        'Join industry pioneers, AI researchers, and cloud architects for an intensive 2-day conference exploring generative agents, scalable systems, and the future of enterprise software. Featuring keynotes from top tech leaders, hands-on workshops, and networking luncheons.',
      category: 'Technology',
      bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      startDate: new Date('2026-11-15T09:30:00.000Z'),
      endDate: new Date('2026-11-16T18:00:00.000Z'),
      venueId: venueMap['Bangalore International Centre'],
      organizerId,
      totalCapacity: 600,
      availableCapacity: 588,
      status: 'PUBLISHED',
      tickets: [
        {
          id: 'tkt_ai_early_bird',
          name: 'Early Bird Pass',
          price: 499,
          totalQuantity: 150,
          availableQuantity: 142,
          description: 'Full conference access, welcome kit, and morning keynote recordings.',
          perks: 'Keynote access, Digital Badge, Coffee & Snacks',
        },
        {
          id: 'tkt_ai_regular',
          name: 'Regular Delegate',
          price: 999,
          totalQuantity: 350,
          availableQuantity: 346,
          description: 'All keynotes, breakout tracks, sponsor expo, and networking dinner.',
          perks: 'Full session access, Buffet lunch, Networking lounge',
        },
        {
          id: 'tkt_ai_vip',
          name: 'VIP All-Access Pass',
          price: 2499,
          totalQuantity: 100,
          availableQuantity: 100,
          description: 'Front-row reserved seating, speaker dinner access, and 1-on-1 mentorship table.',
          perks: 'Front row seats, Private speaker lounge, Gala dinner, Exclusive merchandise',
        },
      ],
    },
    {
      id: 'evt_echoes_indie_jazz',
      title: 'Echoes of Indie: Live Acoustic & Jazz Night',
      description:
        'An intimate candle-lit evening of soul-stirring jazz fusion and indie acoustic melodies featuring premier underground ensembles and instrumental virtuosos in Mumbai historic Royal Opera House.',
      category: 'Music',
      bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      startDate: new Date('2026-11-28T19:00:00.000Z'),
      endDate: new Date('2026-11-28T23:30:00.000Z'),
      venueId: venueMap['Royal Opera House'],
      organizerId,
      totalCapacity: 450,
      availableCapacity: 446,
      status: 'PUBLISHED',
      tickets: [
        {
          id: 'tkt_jazz_general',
          name: 'General Admission',
          price: 399,
          totalQuantity: 250,
          availableQuantity: 248,
          description: 'Entry to main performance hall and standing bar area.',
          perks: 'Concert Entry, 1 Complimentary Beverage',
        },
        {
          id: 'tkt_jazz_lounge',
          name: 'Front Row Lounge',
          price: 899,
          totalQuantity: 150,
          availableQuantity: 148,
          description: 'Plush reserved lounge seating with direct stage visibility.',
          perks: 'Reserved Table, Welcome cocktails, Table service',
        },
        {
          id: 'tkt_jazz_vip',
          name: 'Backstage VIP',
          price: 1599,
          totalQuantity: 50,
          availableQuantity: 50,
          description: 'Meet and greet with artists, autographed tour poster, and after-party pass.',
          perks: 'Backstage pass, Artist meet & greet, Signed vinyl',
        },
      ],
    },
    {
      id: 'evt_fintech_pitch_arena',
      title: 'Fintech Disruptors & Startup Pitch Arena',
      description:
        'The premier gathering for early-stage fintech founders, venture capitalists, and angel syndicates. Watch 20 shortlisted startups battle for seed funding and connect with 50+ institutional investors.',
      category: 'Business',
      bannerUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
      startDate: new Date('2026-12-05T10:00:00.000Z'),
      endDate: new Date('2026-12-05T17:30:00.000Z'),
      venueId: venueMap['Cyber Hub Open Amphitheatre'],
      organizerId,
      totalCapacity: 500,
      availableCapacity: 498,
      status: 'PUBLISHED',
      tickets: [
        {
          id: 'tkt_fintech_visitor',
          name: 'Founder / Visitor Pass',
          price: 299,
          totalQuantity: 300,
          availableQuantity: 298,
          description: 'Access to pitch amphitheatre, open demo zone, and startup showcase.',
          perks: 'Pitch viewing, Expo floor, Digital pitch book',
        },
        {
          id: 'tkt_fintech_investor',
          name: 'Investor / Delegate Pass',
          price: 1299,
          totalQuantity: 200,
          availableQuantity: 200,
          description: 'Access to investor deal room, 1-on-1 founder matchings, and networking cocktail.',
          perks: 'Deal room entry, Private founder meetings, Evening mixer',
        },
      ],
    },
    {
      id: 'evt_laugh_riot_comedy',
      title: 'Laugh Riot: Standup Comedy Special Night',
      description:
        'Get ready for an unstoppable evening of laughter with India top comedic talents testing fresh tour specials. Guaranteed 120 minutes of sheer hilarity, relatable observational humor, and crowd work.',
      category: 'Entertainment',
      bannerUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1200&q=80',
      startDate: new Date('2026-11-20T20:00:00.000Z'),
      endDate: new Date('2026-11-20T22:30:00.000Z'),
      venueId: venueMap['India Habitat Centre'],
      organizerId,
      totalCapacity: 350,
      availableCapacity: 350,
      status: 'PUBLISHED',
      tickets: [
        {
          id: 'tkt_comedy_silver',
          name: 'Silver Balcony',
          price: 249,
          totalQuantity: 150,
          availableQuantity: 150,
          description: 'Upper tier seating with panoramic stage view.',
          perks: 'Balcony seat',
        },
        {
          id: 'tkt_comedy_gold',
          name: 'Gold Stalls',
          price: 549,
          totalQuantity: 150,
          availableQuantity: 150,
          description: 'Main auditorium stalls close to stage action.',
          perks: 'Center stall seating',
        },
        {
          id: 'tkt_comedy_vip',
          name: 'Front Row VIP',
          price: 999,
          totalQuantity: 50,
          availableQuantity: 50,
          description: 'Up-close front rows with crowd-interaction immersion.',
          perks: 'Front row guaranteed, Free mocktail',
        },
      ],
    },
    {
      id: 'evt_food_carnival_2026',
      title: 'Artisanal Craft & Street Food Carnival 2026',
      description:
        'A vibrant weekend celebration of regional culinary mastercraft, artisan bakeries, organic craft brews, and live acoustic music. Taste signature delicacies from 40+ celebrated pop-up kitchens.',
      category: 'Food & Drinks',
      bannerUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      startDate: new Date('2026-12-12T12:00:00.000Z'),
      endDate: new Date('2026-12-13T22:00:00.000Z'),
      venueId: venueMap['Bangalore International Centre'],
      organizerId,
      totalCapacity: 800,
      availableCapacity: 800,
      status: 'PUBLISHED',
      tickets: [
        {
          id: 'tkt_food_single_day',
          name: 'Single Day Tasting Pass',
          price: 199,
          totalQuantity: 500,
          availableQuantity: 500,
          description: 'General festival grounds entry + 3 tasting tokens.',
          perks: 'Festival Entry, 3 Tasting coupons',
        },
        {
          id: 'tkt_food_weekend',
          name: 'Weekend Gourmet Feast',
          price: 499,
          totalQuantity: 300,
          availableQuantity: 300,
          description: '2-day unlimited festival access + 8 food tokens + craft beverage mug.',
          perks: 'Both days access, 8 Food tokens, Souvenir mug',
        },
      ],
    },
    {
      id: 'evt_web3_expo_2026',
      title: 'Future of Web3 & Decentralized Tech Expo',
      description:
        'Experience the future of decentralized computing, smart contract systems, tokenomics, and zero-knowledge architectures. Connect with world-class builders, protocols, and developer communities.',
      category: 'Technology',
      bannerUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
      startDate: new Date('2026-12-18T10:00:00.000Z'),
      endDate: new Date('2026-12-19T18:00:00.000Z'),
      venueId: venueMap['Royal Opera House'],
      organizerId,
      totalCapacity: 500,
      availableCapacity: 500,
      status: 'PUBLISHED',
      tickets: [
        {
          id: 'tkt_web3_early_bird',
          name: 'Early Bird',
          price: 199,
          totalQuantity: 150,
          availableQuantity: 150,
          description: 'Discounted early access to main stage and developer booths.',
          perks: 'Conference access, Early bird lanyard, Hackathon spectator pass',
        },
        {
          id: 'tkt_web3_regular',
          name: 'Regular',
          price: 299,
          totalQuantity: 250,
          availableQuantity: 250,
          description: 'Standard conference pass with breakout sessions and workshop tracks.',
          perks: 'Full session access, Swag bag, Networking lunch',
        },
        {
          id: 'tkt_web3_vip',
          name: 'VIP',
          price: 799,
          totalQuantity: 100,
          availableQuantity: 100,
          description: 'Exclusive lounge pass with keynote speakers and investor cocktail party.',
          perks: 'VIP lounge, Speaker mixer, Premium gift box, Guaranteed front seats',
        },
      ],
    },
  ];

  let totalTicketsSeeded = 0;
  for (const item of eventsData) {
    const { tickets, ...eventPayload } = item;

    // Check by title or id
    let eventRecord = await prisma.event.findFirst({
      where: {
        OR: [{ id: eventPayload.id }, { title: eventPayload.title }],
      },
    });

    if (eventRecord) {
      eventRecord = await prisma.event.update({
        where: { id: eventRecord.id },
        data: {
          description: eventPayload.description,
          category: eventPayload.category,
          bannerUrl: eventPayload.bannerUrl,
          startDate: eventPayload.startDate,
          endDate: eventPayload.endDate,
          venueId: eventPayload.venueId,
          organizerId: eventPayload.organizerId,
          totalCapacity: eventPayload.totalCapacity,
          status: eventPayload.status,
          updatedAt: new Date(),
        },
      });
    } else {
      eventRecord = await prisma.event.create({
        data: {
          ...eventPayload,
          updatedAt: new Date(),
        },
      });
    }

    // Seed ticket types for this event
    for (const ticket of tickets) {
      const existingTicket = await prisma.ticketType.findFirst({
        where: {
          eventId: eventRecord.id,
          name: ticket.name,
        },
      });

      if (existingTicket) {
        await prisma.ticketType.update({
          where: { id: existingTicket.id },
          data: {
            price: ticket.price,
            totalQuantity: ticket.totalQuantity,
            description: ticket.description,
            perks: ticket.perks,
            updatedAt: new Date(),
          },
        });
      } else {
        await prisma.ticketType.create({
          data: {
            id: ticket.id || generateId(),
            eventId: eventRecord.id,
            name: ticket.name,
            price: ticket.price,
            totalQuantity: ticket.totalQuantity,
            availableQuantity: ticket.availableQuantity,
            description: ticket.description,
            perks: ticket.perks,
            updatedAt: new Date(),
          },
        });
      }
      totalTicketsSeeded++;
    }
  }

  console.log(`✅ Seeded ${eventsData.length} events and ${totalTicketsSeeded} ticket types.`);

  // 4. Seed Sample Reviews
  console.log('⭐ Seeding reviews...');
  const firstEvent = await prisma.event.findFirst({ where: { title: { contains: 'AI' } } });
  const aaravUserId = userMap['user@eventnest.com'];
  const nehaUserId = userMap['neha@example.com'];

  if (firstEvent && aaravUserId) {
    await prisma.review.upsert({
      where: {
        eventId_userId: {
          eventId: firstEvent.id,
          userId: aaravUserId,
        },
      },
      update: {
        rating: 5,
        comment: 'Exceptional conference! The generative AI sessions and cloud architecture panels were top-notch.',
        updatedAt: new Date(),
      },
      create: {
        id: 'rev_ai_aarav',
        eventId: firstEvent.id,
        userId: aaravUserId,
        rating: 5,
        comment: 'Exceptional conference! The generative AI sessions and cloud architecture panels were top-notch.',
        updatedAt: new Date(),
      },
    });
  }

  if (firstEvent && nehaUserId) {
    await prisma.review.upsert({
      where: {
        eventId_userId: {
          eventId: firstEvent.id,
          userId: nehaUserId,
        },
      },
      update: {
        rating: 5,
        comment: 'Great organization and smooth ticketing flow. Loved the networking dinner too!',
        updatedAt: new Date(),
      },
      create: {
        id: 'rev_ai_neha',
        eventId: firstEvent.id,
        userId: nehaUserId,
        rating: 5,
        comment: 'Great organization and smooth ticketing flow. Loved the networking dinner too!',
        updatedAt: new Date(),
      },
    });
  }
  console.log('✅ Seeded sample reviews.');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('📋 Test Credentials:');
  console.log('   - Organizer: organizer@eventnest.com | Password@123');
  console.log('   - User:      user@eventnest.com      | Password@123');
  console.log('   - Admin:     admin@eventnest.com     | Password@123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
