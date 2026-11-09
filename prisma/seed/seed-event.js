
const { PrismaClient } = require("@prisma/client");
const { randomUUID } = require("crypto");
require("dotenv").config();

const prisma = new PrismaClient();

// Every event has an individually assigned image.
// Images are not selected by category.
const eventData = [
  // =========================
  // COMPLETED / PAST EVENTS
  // =========================

  {
    title: "Delhi Tech Summit 2026",
    category: "Technology",
    description: "A technology summit featuring developers, founders and industry experts.",
    date: "2026-10-05",
    format: "IN_PERSON",
    venueIndex: 0,
    capacity: 500,
    status: "COMPLETED",
    bannerUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "AI and Machine Learning Workshop",
    category: "Technology",
    description: "A hands-on workshop exploring machine learning and practical AI applications.",
    date: "2026-10-08",
    format: "ONLINE",
    venueIndex: null,
    capacity: 300,
    status: "COMPLETED",
    bannerUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Startup Founders Meetup",
    category: "Business",
    description: "A networking event for entrepreneurs, founders and investors.",
    date: "2026-10-12",
    format: "IN_PERSON",
    venueIndex: 1,
    capacity: 200,
    status: "COMPLETED",
    bannerUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Creative Design Conference",
    category: "Design",
    description: "Explore graphic design, branding, typography and digital experiences.",
    date: "2026-10-15",
    format: "ONLINE",
    venueIndex: null,
    capacity: 250,
    status: "COMPLETED",
    bannerUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Delhi Music Festival",
    category: "Music",
    description: "An evening of independent music and live performances.",
    date: "2026-10-18",
    format: "IN_PERSON",
    venueIndex: 2,
    capacity: 800,
    status: "COMPLETED",
    bannerUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Photography Masterclass",
    category: "Arts",
    description: "Learn composition, lighting and visual storytelling.",
    date: "2026-10-20",
    format: "ONLINE",
    venueIndex: null,
    capacity: 150,
    status: "COMPLETED",
    bannerUrl: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "National Hackathon 2026",
    category: "Technology",
    description: "A collaborative hackathon for developers and innovators.",
    date: "2026-10-22",
    format: "IN_PERSON",
    venueIndex: 3,
    capacity: 400,
    status: "COMPLETED",
    bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Digital Marketing Masterclass",
    category: "Business",
    description: "Learn SEO, performance marketing and content strategy.",
    date: "2026-10-24",
    format: "ONLINE",
    venueIndex: null,
    capacity: 180,
    status: "COMPLETED",
    bannerUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Yoga and Wellness Retreat",
    category: "Health",
    description: "Guided yoga, meditation and mindfulness sessions.",
    date: "2026-10-26",
    format: "IN_PERSON",
    venueIndex: 4,
    capacity: 120,
    status: "COMPLETED",
    bannerUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Frontend Development Bootcamp",
    category: "Education",
    description: "A practical bootcamp covering HTML, CSS, JavaScript and React.",
    date: "2026-10-28",
    format: "ONLINE",
    venueIndex: null,
    capacity: 200,
    status: "COMPLETED",
    bannerUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Product Design Networking Night",
    category: "Design",
    description: "Meet product designers, UX researchers and creative professionals.",
    date: "2026-10-30",
    format: "IN_PERSON",
    venueIndex: 5,
    capacity: 150,
    status: "COMPLETED",
    bannerUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Future of Web Development",
    category: "Technology",
    description: "Explore modern web architecture and developer technologies.",
    date: "2026-11-05",
    format: "ONLINE",
    venueIndex: null,
    capacity: 300,
    status: "COMPLETED",
    bannerUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=85",
  },

  // =========================
  // UPCOMING EVENTS
  // =========================

  {
    title: "Mumbai Startup Expo",
    category: "Business",
    description: "A startup exhibition connecting founders and investors.",
    date: "2026-11-15",
    format: "IN_PERSON",
    venueIndex: 6,
    capacity: 600,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "UI UX Design Sprint",
    category: "Design",
    description: "A guided design sprint focused on user research and prototyping.",
    date: "2026-11-18",
    format: "ONLINE",
    venueIndex: null,
    capacity: 120,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Bengaluru Developer Conference",
    category: "Technology",
    description: "A developer conference covering software engineering and cloud technologies.",
    date: "2026-11-21",
    format: "IN_PERSON",
    venueIndex: 7,
    capacity: 500,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Personal Branding Workshop",
    category: "Business",
    description: "Build a professional online presence and personal brand.",
    date: "2026-11-24",
    format: "ONLINE",
    venueIndex: null,
    capacity: 180,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Photography Walk",
    category: "Arts",
    description: "A practical outdoor photography and storytelling experience.",
    date: "2026-11-27",
    format: "IN_PERSON",
    venueIndex: 8,
    capacity: 80,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Career Launch Webinar",
    category: "Education",
    description: "Career guidance, interview preparation and industry insights.",
    date: "2026-11-30",
    format: "ONLINE",
    venueIndex: null,
    capacity: 500,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Chennai Cultural Evening",
    category: "Music",
    description: "An evening celebrating music, dance and local culture.",
    date: "2026-12-03",
    format: "IN_PERSON",
    venueIndex: 9,
    capacity: 700,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "AI for Everyone Webinar",
    category: "Technology",
    description: "Understand generative AI, automation and real-world AI use cases.",
    date: "2026-12-06",
    format: "ONLINE",
    venueIndex: null,
    capacity: 400,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Hyderabad Innovation Summit",
    category: "Technology",
    description: "A summit exploring innovation, startups and emerging technologies.",
    date: "2026-12-09",
    format: "IN_PERSON",
    venueIndex: 10,
    capacity: 500,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Content Creation Bootcamp",
    category: "Lifestyle",
    description: "Learn video creation, storytelling and content strategy.",
    date: "2026-12-12",
    format: "ONLINE",
    venueIndex: null,
    capacity: 150,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Kolkata Business Forum",
    category: "Business",
    description: "A forum for business owners and professionals to exchange ideas.",
    date: "2026-12-15",
    format: "IN_PERSON",
    venueIndex: 11,
    capacity: 350,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Python for Beginners",
    category: "Education",
    description: "An interactive beginner-friendly Python programming workshop.",
    date: "2026-12-18",
    format: "ONLINE",
    venueIndex: null,
    capacity: 200,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "The Indie Music Experience",
    category: "Music",
    description: "Discover independent artists and live music performances.",
    date: "2026-12-21",
    format: "IN_PERSON",
    venueIndex: 2,
    capacity: 900,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Product Management Webinar",
    category: "Business",
    description: "Learn product strategy, roadmaps and product discovery.",
    date: "2026-12-24",
    format: "ONLINE",
    venueIndex: null,
    capacity: 250,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Creative Arts Festival",
    category: "Arts",
    description: "An event celebrating illustration, photography and creative expression.",
    date: "2026-12-27",
    format: "IN_PERSON",
    venueIndex: 5,
    capacity: 300,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Modern JavaScript Workshop",
    category: "Education",
    description: "Explore modern JavaScript, asynchronous programming and APIs.",
    date: "2026-12-30",
    format: "ONLINE",
    venueIndex: null,
    capacity: 180,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Entrepreneurship Conclave",
    category: "Business",
    description: "A gathering for aspiring entrepreneurs, founders and mentors.",
    date: "2027-01-03",
    format: "IN_PERSON",
    venueIndex: 0,
    capacity: 450,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Fitness and Mindfulness Day",
    category: "Health",
    description: "A wellness event focused on movement, mindfulness and healthy habits.",
    date: "2027-01-06",
    format: "ONLINE",
    venueIndex: null,
    capacity: 300,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "The Future of E-Commerce",
    category: "Business",
    description: "Explore digital commerce, consumer behaviour and emerging retail technologies.",
    date: "2027-01-09",
    format: "IN_PERSON",
    venueIndex: 1,
    capacity: 250,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "React and Full Stack Development",
    category: "Technology",
    description: "A practical session covering React, APIs and full-stack application development.",
    date: "2027-01-12",
    format: "ONLINE",
    venueIndex: null,
    capacity: 350,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "The Art of Visual Storytelling",
    category: "Arts",
    description: "Explore the art of visual narratives through photography and creative direction.",
    date: "2027-01-15",
    format: "IN_PERSON",
    venueIndex: 3,
    capacity: 180,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Cybersecurity Awareness Summit",
    category: "Technology",
    description: "Learn about digital security, ethical hacking and modern cyber threats.",
    date: "2027-01-18",
    format: "ONLINE",
    venueIndex: null,
    capacity: 400,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Designers and Creators Meetup",
    category: "Design",
    description: "A creative networking experience for designers, illustrators and makers.",
    date: "2027-01-21",
    format: "IN_PERSON",
    venueIndex: 4,
    capacity: 160,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Personal Finance Masterclass",
    category: "Education",
    description: "Understand budgeting, saving, investing fundamentals and financial planning.",
    date: "2027-01-24",
    format: "ONLINE",
    venueIndex: null,
    capacity: 220,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Spring Music and Arts Night",
    category: "Music",
    description: "A live evening featuring emerging musicians and independent performers.",
    date: "2027-01-27",
    format: "IN_PERSON",
    venueIndex: 6,
    capacity: 750,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Cloud Computing Essentials",
    category: "Technology",
    description: "An introduction to cloud infrastructure, deployment and scalable applications.",
    date: "2027-01-30",
    format: "ONLINE",
    venueIndex: null,
    capacity: 300,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Wellness and Nutrition Conference",
    category: "Health",
    description: "Explore nutrition, healthy routines and sustainable wellness practices.",
    date: "2027-02-03",
    format: "IN_PERSON",
    venueIndex: 8,
    capacity: 200,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "The Creator Economy Webinar",
    category: "Lifestyle",
    description: "Discover how creators build communities, brands and digital businesses.",
    date: "2027-02-07",
    format: "ONLINE",
    venueIndex: null,
    capacity: 250,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "National Innovation and Startup Expo",
    category: "Business",
    description: "A showcase of new ventures, emerging products and entrepreneurial ideas.",
    date: "2027-02-11",
    format: "IN_PERSON",
    venueIndex: 10,
    capacity: 600,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Data Science and Analytics Workshop",
    category: "Education",
    description: "Learn data analysis, visualisation and practical data science workflows.",
    date: "2027-02-15",
    format: "ONLINE",
    venueIndex: null,
    capacity: 300,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Contemporary Art Exhibition",
    category: "Arts",
    description: "An exhibition celebrating contemporary artists and experimental creative work.",
    date: "2027-02-19",
    format: "IN_PERSON",
    venueIndex: 11,
    capacity: 350,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Building with APIs and Node.js",
    category: "Technology",
    description: "A developer session on REST APIs, Express.js and backend architecture.",
    date: "2027-02-23",
    format: "ONLINE",
    venueIndex: null,
    capacity: 250,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Grand Startup and Leadership Forum",
    category: "Business",
    description: "A leadership forum bringing together founders, executives and young entrepreneurs.",
    date: "2027-02-27",
    format: "IN_PERSON",
    venueIndex: 9,
    capacity: 500,
    status: "PUBLISHED",
    bannerUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=85",
  },
];

async function main() {
  const organizer = await prisma.user.findFirst({
    where: {
      role: {
        in: ["ORGANIZER", "ADMIN"],
      },
    },
  });

  if (!organizer) {
    throw new Error(
      "No ORGANIZER or ADMIN found. Seed users first."
    );
  }

  const venues = await prisma.venue.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  if (venues.length === 0) {
    throw new Error(
      "No venues found. Run seed-venue.js first."
    );
  }

  let created = 0;
  let updated = 0;

  for (const [index, item] of eventData.entries()) {
    const {
      title,
      category,
      description,
      date,
      format,
      venueIndex,
      capacity,
      status,
      bannerUrl,
    } = item;

    const startDate = new Date(`${date}T10:00:00`);
    const endDate = new Date(`${date}T17:00:00`);

    const venue =
      format === "IN_PERSON"
        ? venues[venueIndex]
        : null;

    if (format === "IN_PERSON" && !venue) {
      throw new Error(
        `Venue missing for event: ${title}. Check venueIndex and seed venues first.`
      );
    }

    const existingEvent = await prisma.event.findFirst({
      where: {
        title,
        organizerId: organizer.id,
      },
    });

    // Preserve the number of tickets already booked when updating.
    const bookedCount = existingEvent
      ? existingEvent.totalCapacity -
        existingEvent.availableCapacity
      : 0;

    const availableCapacity = Math.max(
      0,
      capacity - bookedCount
    );

    const payload = {
      title,
      description,
      category,
      format,
      bannerUrl,
      startDate,
      endDate,
      totalCapacity: capacity,
      availableCapacity,
      status,
      organizerId: organizer.id,
      venueId: venue?.id || null,
      updatedAt: new Date(),
    };

    const savedEvent = existingEvent
      ? await prisma.event.update({
          where: {
            id: existingEvent.id,
          },
          data: payload,
        })
      : await prisma.event.create({
          data: {
            id: randomUUID(),
            ...payload,
            createdAt: new Date(),
          },
        });

    // Ticket distribution
    const generalQuantity = Math.floor(capacity * 0.7);
    const premiumQuantity = capacity - generalQuantity;

    const ticketOptions = [
      {
        name: "General Pass",
        price: 299 + (index % 5) * 100,
        quantity: generalQuantity,
      },
      {
        name: "Premium Pass",
        price: 699 + (index % 5) * 150,
        quantity: premiumQuantity,
      },
    ];

    for (const ticket of ticketOptions) {
      const existingTicket =
        await prisma.ticketType.findFirst({
          where: {
            eventId: savedEvent.id,
            name: ticket.name,
          },
        });

      // Preserve already sold ticket quantities.
      const soldQuantity = existingTicket
        ? existingTicket.totalQuantity -
          existingTicket.availableQuantity
        : 0;

      const availableQuantity = Math.max(
        0,
        ticket.quantity - soldQuantity
      );

      const ticketPayload = {
        name: ticket.name,
        price: ticket.price,
        totalQuantity: ticket.quantity,
        availableQuantity,
        description: `${ticket.name} for ${title}`,
        perks:
          ticket.name === "Premium Pass"
            ? "Priority access, premium seating and event resources"
            : "Standard event access",
        updatedAt: new Date(),
      };

      if (existingTicket) {
        await prisma.ticketType.update({
          where: {
            id: existingTicket.id,
          },
          data: ticketPayload,
        });
      } else {
        await prisma.ticketType.create({
          data: {
            id: randomUUID(),
            eventId: savedEvent.id,
            ...ticketPayload,
            createdAt: new Date(),
          },
        });
      }
    }

    if (existingEvent) {
      updated++;
    } else {
      created++;
    }

    console.log(
      `${format} | ${status} | ${
        existingEvent ? "Updated" : "Created"
      }: ${title}`
    );
  }

  const pastCount = eventData.filter(
    (event) => event.status === "COMPLETED"
  ).length;

  const upcomingCount = eventData.filter(
    (event) => event.status === "PUBLISHED"
  ).length;

  const onlineCount = eventData.filter(
    (event) => event.format === "ONLINE"
  ).length;

  const inPersonCount = eventData.filter(
    (event) => event.format === "IN_PERSON"
  ).length;

  console.log("\n================================");
  console.log("EVENT SEEDING COMPLETED");
  console.log("================================");
  console.log(`Created: ${created}`);
  console.log(`Updated: ${updated}`);
  console.log(`Total processed: ${eventData.length}`);
  console.log(`Completed events: ${pastCount}`);
  console.log(`Upcoming events: ${upcomingCount}`);
  console.log(`Online events: ${onlineCount}`);
  console.log(`In-person events: ${inPersonCount}`);
  console.log("================================");
}

main()
  .catch((error) => {
    console.error("Event seed error:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
