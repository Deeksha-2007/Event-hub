
// ─── EventNest Local Preview Data ────────────────────────────────────────────
// This file provides realistic sample event data so every page renders
// without a running backend or database.  The existing Axios API service
// in src/services/api.js is preserved and will take over when a backend
// is configured.

const mockEvents = [
  {
    id: "event-1",
    title: "Future of Artificial Intelligence",
    name: "Future of Artificial Intelligence",
    description:
      "A full-day deep-dive into the latest breakthroughs in AI — from large language models and generative art to robotics and ethical considerations. Industry leaders, researchers and builders come together for a day of talks, demos and live Q&A sessions that will shape your perspective on the decade ahead.",
    category: "Technology",
    eventDate: "2026-11-12T10:00:00",
    date: "2026-11-12",
    startDate: "2026-11-12T10:00:00",
    time: "10:00 AM",
    location: "New Delhi",
    venue: "India Habitat Centre, Lodhi Road, New Delhi",
    price: 499,
    ticketPrice: 499,
    format: "In-person",
    organizer: "TechFront India",
    tags: ["AI", "Technology", "Innovation", "Summit"],
    capacity: 800,
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t1a", name: "General", price: 499, available: 320, total: 500 },
      { id: "t1b", name: "VIP", price: 1299, available: 45, total: 100 },
      { id: "t1c", name: "Workshop Add-on", price: 799, available: 80, total: 200 },
    ],
  },
  {
    id: "event-2",
    title: "Indie Music Night",
    name: "Indie Music Night",
    description:
      "Curated independent artists take the stage for an intimate evening of original music. Discover your next favourite artist before they headline festivals. Expect raw acoustics, electric sets and a community of music lovers who care about authenticity over charts.",
    category: "Music",
    eventDate: "2026-11-15T18:30:00",
    date: "2026-11-15",
    startDate: "2026-11-15T18:30:00",
    time: "6:30 PM",
    location: "Gurugram",
    venue: "Cyber Hub Amphitheatre, Gurugram",
    price: 799,
    ticketPrice: 799,
    format: "In-person",
    organizer: "Reverb Events",
    tags: ["Indie", "Live Music", "Acoustic"],
    capacity: 400,
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t2a", name: "Floor", price: 799, available: 150, total: 200 },
      { id: "t2b", name: "Seated", price: 599, available: 90, total: 150 },
      { id: "t2c", name: "Backstage", price: 1999, available: 12, total: 20 },
    ],
  },
  {
    id: "event-3",
    title: "Startup Founders Meetup",
    name: "Startup Founders Meetup",
    description:
      "The most candid founder conversation in the city. Thirty-minute lightning talks, peer roundtables, and open networking with investors and operators. Whether you are pre-idea or Series A, this is the room where honest conversations happen and real partnerships form.",
    category: "Business",
    eventDate: "2026-11-18T11:00:00",
    date: "2026-11-18",
    startDate: "2026-11-18T11:00:00",
    time: "11:00 AM",
    location: "Gurugram",
    venue: "WeWork Galaxy, DLF Cyber City, Gurugram",
    price: 299,
    ticketPrice: 299,
    format: "In-person",
    organizer: "FounderCircle Delhi",
    tags: ["Startup", "Networking", "Business"],
    capacity: 200,
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t3a", name: "General", price: 299, available: 120, total: 150 },
      { id: "t3b", name: "Investor Pass", price: 999, available: 20, total: 30 },
    ],
  },
  {
    id: "event-4",
    title: "Creative Design Workshop",
    name: "Creative Design Workshop",
    description:
      "A hands-on, project-based workshop where you will learn practical design thinking, rapid prototyping, and user-centred problem solving. Led by senior designers from top product companies. Bring your laptop and an open mind — you will leave with a complete design sprint under your belt.",
    category: "Workshops",
    eventDate: "2026-11-20T14:00:00",
    date: "2026-11-20",
    startDate: "2026-11-20T14:00:00",
    time: "2:00 PM",
    location: "New Delhi",
    venue: "91springboard, Connaught Place, New Delhi",
    price: 399,
    ticketPrice: 399,
    format: "In-person",
    organizer: "Design Collective NCR",
    tags: ["Design", "Workshop", "Creative"],
    capacity: 60,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t4a", name: "Workshop Seat", price: 399, available: 22, total: 60 },
    ],
  },
  {
    id: "event-5",
    title: "Food and Culture Festival",
    name: "Food and Culture Festival",
    description:
      "Two days celebrating the diversity of Indian street food and local artisan culture. Forty vendors, live cooking demonstrations, cultural performances, craft stalls and a curated marketplace of small-batch producers. An experience for all ages and every palate.",
    category: "Food & Drinks",
    eventDate: "2026-11-22T12:00:00",
    date: "2026-11-22",
    startDate: "2026-11-22T12:00:00",
    time: "12:00 PM",
    location: "New Delhi",
    venue: "DLF Avenue Saket, New Delhi",
    price: 199,
    ticketPrice: 199,
    format: "In-person",
    organizer: "Local Roots",
    tags: ["Food", "Culture", "Festival"],
    capacity: 2000,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t5a", name: "Day Pass", price: 199, available: 900, total: 1000 },
      { id: "t5b", name: "Weekend Pass", price: 349, available: 380, total: 500 },
      { id: "t5c", name: "VIP Tasting", price: 799, available: 60, total: 100 },
    ],
  },
  {
    id: "event-6",
    title: "Digital Entertainment Expo",
    name: "Digital Entertainment Expo",
    description:
      "The region's largest showcase of interactive entertainment — gaming installations, VR experiences, digital art, esports tournaments and creator meetups. Three floors of immersive content from global and homegrown studios. Meet the creators, play the unreleased builds and be part of the story.",
    category: "Entertainment",
    eventDate: "2026-11-25T16:00:00",
    date: "2026-11-25",
    startDate: "2026-11-25T16:00:00",
    time: "4:00 PM",
    location: "New Delhi",
    venue: "Pragati Maidan, New Delhi",
    price: 599,
    ticketPrice: 599,
    format: "In-person",
    organizer: "Play India Events",
    tags: ["Gaming", "VR", "Entertainment", "Expo"],
    capacity: 5000,
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t6a", name: "General", price: 599, available: 2800, total: 3500 },
      { id: "t6b", name: "Creator Pass", price: 1499, available: 180, total: 300 },
    ],
  },
  {
    id: "event-7",
    title: "Web Development Summit",
    name: "Web Development Summit",
    description:
      "An online summit bringing together frontend, backend and full-stack engineers to share real-world lessons from shipping products at scale. Topics cover React performance, edge computing, API design, testing culture and the future of the web platform. Fully virtual — join from anywhere.",
    category: "Technology",
    eventDate: "2026-11-28T17:00:00",
    date: "2026-11-28",
    startDate: "2026-11-28T17:00:00",
    time: "5:00 PM",
    location: "Online",
    venue: "Online",
    price: 0,
    ticketPrice: 0,
    format: "Online",
    organizer: "DevConf India",
    tags: ["Web", "React", "Engineering", "Online"],
    capacity: 5000,
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t7a", name: "Free Access", price: 0, available: 4000, total: 5000 },
    ],
  },
  {
    id: "event-8",
    title: "Community Networking Evening",
    name: "Community Networking Evening",
    description:
      "A relaxed, structured networking event for professionals across industries. Speed networking rounds, facilitated group conversations and open socialising. No pitches, no agendas — just genuine conversations with people you would not have met otherwise.",
    category: "Business",
    eventDate: "2026-11-30T18:00:00",
    date: "2026-11-30",
    startDate: "2026-11-30T18:00:00",
    time: "6:00 PM",
    location: "Gurugram",
    venue: "Sectorr29 Social, Gurugram",
    price: 0,
    ticketPrice: 0,
    format: "In-person",
    organizer: "NCR Connect",
    tags: ["Networking", "Community", "Free"],
    capacity: 120,
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t8a", name: "Free Entry", price: 0, available: 80, total: 120 },
    ],
  },
  {
    id: "event-9",
    title: "Acoustic Sessions",
    name: "Acoustic Sessions",
    description:
      "An intimate evening of acoustic music in one of Delhi's most beloved heritage venues. Three carefully selected artists, no amplification, forty people maximum. A rare chance to experience music the way it was meant to be heard — close, honest and unrepeatable.",
    category: "Music",
    eventDate: "2026-12-03T19:00:00",
    date: "2026-12-03",
    startDate: "2026-12-03T19:00:00",
    time: "7:00 PM",
    location: "New Delhi",
    venue: "Hauz Khas Village, New Delhi",
    price: 450,
    ticketPrice: 450,
    format: "In-person",
    organizer: "Hauz Khas Live",
    tags: ["Acoustic", "Intimate", "Music"],
    capacity: 40,
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t9a", name: "Seated", price: 450, available: 18, total: 40 },
    ],
  },
  {
    id: "event-10",
    title: "Product Thinking Masterclass",
    name: "Product Thinking Masterclass",
    description:
      "A full-day intensive with product leaders from leading consumer tech companies. Covers discovery and validation, prioritisation frameworks, cross-functional alignment, metrics that matter, and how to think about growth without compromising user trust. Limited seats to maintain workshop quality.",
    category: "Business",
    eventDate: "2026-12-05T10:00:00",
    date: "2026-12-05",
    startDate: "2026-12-05T10:00:00",
    time: "10:00 AM",
    location: "Gurugram",
    venue: "Golf Course Road, Gurugram",
    price: 999,
    ticketPrice: 999,
    format: "In-person",
    organizer: "Product School India",
    tags: ["Product", "Management", "Workshop"],
    capacity: 50,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t10a", name: "Full Day", price: 999, available: 15, total: 50 },
    ],
  },
  {
    id: "event-11",
    title: "Street Food Weekend",
    name: "Street Food Weekend",
    description:
      "A curated weekend market celebrating Noida's most beloved street food vendors alongside exciting newcomers. Expect chaat, golgappa bars, biryani stations, dessert corners and live cooking demonstrations. Family-friendly, pet-friendly and filled with flavour.",
    category: "Food & Drinks",
    eventDate: "2026-12-08T13:00:00",
    date: "2026-12-08",
    startDate: "2026-12-08T13:00:00",
    time: "1:00 PM",
    location: "Noida",
    venue: "Sector 18 Market, Noida",
    price: 150,
    ticketPrice: 150,
    format: "In-person",
    organizer: "Noida Food Trail",
    tags: ["Street Food", "Market", "Weekend"],
    capacity: 1500,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t11a", name: "Entry", price: 150, available: 800, total: 1000 },
    ],
  },
  {
    id: "event-12",
    title: "Creative Futures Conference",
    name: "Creative Futures Conference",
    description:
      "A gathering for designers, filmmakers, writers, musicians and anyone building the next generation of digital and physical experiences. Talks on creative process, the economics of independent creative work, collaboration across disciplines and building a practice that lasts.",
    category: "Entertainment",
    eventDate: "2026-12-12T11:00:00",
    date: "2026-12-12",
    startDate: "2026-12-12T11:00:00",
    time: "11:00 AM",
    location: "New Delhi",
    venue: "T3, Aerocity, New Delhi",
    price: 699,
    ticketPrice: 699,
    format: "In-person",
    organizer: "Create India Foundation",
    tags: ["Creative", "Conference", "Art"],
    capacity: 600,
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t12a", name: "General", price: 699, available: 280, total: 400 },
      { id: "t12b", name: "Creator", price: 1199, available: 90, total: 200 },
    ],
  },
  {
    id: "event-13",
    title: "Electronic Music Festival",
    name: "Electronic Music Festival",
    description:
      "A landmark outdoor electronic music festival spanning two stages and eight hours. Headlined by internationally-recognised DJs and producers, with a dedicated stage for emerging local talent. Expect immersive lighting design, curated food village and an atmosphere that stays with you for years.",
    category: "Music",
    eventDate: "2026-12-18T16:00:00",
    date: "2026-12-18",
    startDate: "2026-12-18T16:00:00",
    time: "4:00 PM",
    location: "New Delhi",
    venue: "NSIC Exhibition Grounds, New Delhi",
    price: 1299,
    ticketPrice: 1299,
    format: "In-person",
    organizer: "Bassline Collective",
    tags: ["Electronic", "Festival", "EDM", "Outdoor"],
    capacity: 8000,
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t13a", name: "General", price: 1299, available: 4500, total: 6000 },
      { id: "t13b", name: "VIP Lounge", price: 2999, available: 320, total: 500 },
      { id: "t13c", name: "Backstage", price: 5999, available: 40, total: 50 },
    ],
  },
  {
    id: "event-14",
    title: "Photography Masterclass",
    name: "Photography Masterclass",
    description:
      "A one-day intensive workshop covering composition, light and storytelling through the lens. Morning theory sessions followed by an afternoon photo walk through heritage Delhi, ending with a group critique and editing demo. Suitable for beginners and intermediate photographers.",
    category: "Workshops",
    eventDate: "2026-12-20T09:00:00",
    date: "2026-12-20",
    startDate: "2026-12-20T09:00:00",
    time: "9:00 AM",
    location: "New Delhi",
    venue: "Lodhi Art District, New Delhi",
    price: 599,
    ticketPrice: 599,
    format: "In-person",
    organizer: "Frame & Moment",
    tags: ["Photography", "Workshop", "Art"],
    capacity: 25,
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t14a", name: "Workshop Seat", price: 599, available: 8, total: 25 },
    ],
  },
  {
    id: "event-15",
    title: "Business Growth Summit",
    name: "Business Growth Summit",
    description:
      "A day-long summit for business owners and operators focused on practical growth strategies. Sessions cover customer acquisition, retention mechanics, unit economics, building teams and accessing capital. Panel discussions with founders who have built at scale in the Indian market.",
    category: "Business",
    eventDate: "2026-12-22T09:30:00",
    date: "2026-12-22",
    startDate: "2026-12-22T09:30:00",
    time: "9:30 AM",
    location: "Gurugram",
    venue: "Marriott Gurugram",
    price: 1499,
    ticketPrice: 1499,
    format: "In-person",
    organizer: "Entrepreneurs India",
    tags: ["Business", "Growth", "Summit"],
    capacity: 350,
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t15a", name: "Delegate", price: 1499, available: 180, total: 300 },
      { id: "t15b", name: "VIP", price: 3499, available: 28, total: 50 },
    ],
  },
  {
    id: "event-16",
    title: "Comedy Night Live",
    name: "Comedy Night Live",
    description:
      "The best standup comedians in the country, performing fresh sets to a packed house. Hosted by a beloved MC, the evening features five performers across genres — observational, dark, absurdist, storytelling and topical. Expect to leave with aching sides and a favourite new comedian.",
    category: "Entertainment",
    eventDate: "2026-12-26T20:00:00",
    date: "2026-12-26",
    startDate: "2026-12-26T20:00:00",
    time: "8:00 PM",
    location: "Noida",
    venue: "The Comedy Factory, Sector 62, Noida",
    price: 499,
    ticketPrice: 499,
    format: "In-person",
    organizer: "Punchline Productions",
    tags: ["Comedy", "Standup", "Entertainment"],
    capacity: 250,
    image:
      "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t16a", name: "General", price: 499, available: 140, total: 200 },
      { id: "t16b", name: "Front Row", price: 799, available: 22, total: 40 },
    ],
  },
  {
    id: "event-17",
    title: "Yoga & Wellness Retreat",
    name: "Yoga & Wellness Retreat",
    description:
      "A morning wellness experience for the city: guided yoga flows, breathwork, meditation and a nutritionist-led discussion on sustainable health habits. Set in a rooftop green space with breakfast included. Beginners welcome; all levels accommodated.",
    category: "Wellness",
    eventDate: "2026-12-28T07:00:00",
    date: "2026-12-28",
    startDate: "2026-12-28T07:00:00",
    time: "7:00 AM",
    location: "New Delhi",
    venue: "The Rooftop, Greater Kailash, New Delhi",
    price: 349,
    ticketPrice: 349,
    format: "In-person",
    organizer: "Breathe Collective",
    tags: ["Wellness", "Yoga", "Health"],
    capacity: 40,
    image:
      "https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t17a", name: "Session", price: 349, available: 18, total: 40 },
    ],
  },
  {
    id: "event-18",
    title: "Fashion Forward Show",
    name: "Fashion Forward Show",
    description:
      "A showcase of emerging Indian designers presenting their Spring 2027 collections. Seven labels, live runway show, curated pop-up market and a panel on building sustainable fashion brands. A night at the intersection of culture, craft and commerce.",
    category: "Entertainment",
    eventDate: "2026-12-30T19:00:00",
    date: "2026-12-30",
    startDate: "2026-12-30T19:00:00",
    time: "7:00 PM",
    location: "Gurugram",
    venue: "AIRIA Mall Atrium, Gurugram",
    price: 899,
    ticketPrice: 899,
    format: "In-person",
    organizer: "Fashion Week India",
    tags: ["Fashion", "Design", "Runway"],
    capacity: 500,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t18a", name: "General", price: 899, available: 250, total: 400 },
      { id: "t18b", name: "Front Row", price: 2499, available: 40, total: 60 },
    ],
  },
  // Past events (for My Bookings demo)
  {
    id: "event-19",
    title: "Jazz Under the Stars",
    name: "Jazz Under the Stars",
    description:
      "An evening of classic and contemporary jazz in an open-air setting. Award-winning musicians delivered a set that ranged from bebop to smooth jazz fusion.",
    category: "Music",
    eventDate: "2026-09-14T19:30:00",
    date: "2026-09-14",
    startDate: "2026-09-14T19:30:00",
    time: "7:30 PM",
    location: "New Delhi",
    venue: "IGNCA, Janpath, New Delhi",
    price: 649,
    ticketPrice: 649,
    format: "In-person",
    organizer: "Delhi Jazz Society",
    tags: ["Jazz", "Outdoor", "Music"],
    capacity: 200,
    image:
      "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t19a", name: "General", price: 649, available: 0, total: 200 },
    ],
  },
  {
    id: "event-20",
    title: "UX Research Bootcamp",
    name: "UX Research Bootcamp",
    description:
      "A two-day bootcamp that gave participants hands-on experience with qualitative and quantitative research methods.",
    category: "Workshops",
    eventDate: "2026-08-22T09:00:00",
    date: "2026-08-22",
    startDate: "2026-08-22T09:00:00",
    time: "9:00 AM",
    location: "Gurugram",
    venue: "NIIT University Campus, Gurugram",
    price: 799,
    ticketPrice: 799,
    format: "In-person",
    organizer: "UX India",
    tags: ["UX", "Research", "Bootcamp"],
    capacity: 40,
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { id: "t20a", name: "Bootcamp Seat", price: 799, available: 0, total: 40 },
    ],
  },
];

export { mockEvents };
export default mockEvents;


// ─── Helper Functions ─────────────────────────────────────────────────────────

const NOW = new Date();

/** Returns events whose startDate is in the future, sorted by earliest first. */
export function getUpcomingEvents() {
  return mockEvents
    .filter((e) => new Date(e.startDate || e.eventDate) > NOW)
    .sort(
      (a, b) =>
        new Date(a.startDate || a.eventDate) -
        new Date(b.startDate || b.eventDate)
    );
}

/** Returns events whose startDate is in the past, sorted by most-recent first. */
export function getPastEvents() {
  return mockEvents
    .filter((e) => new Date(e.startDate || e.eventDate) <= NOW)
    .sort(
      (a, b) =>
        new Date(b.startDate || b.eventDate) -
        new Date(a.startDate || a.eventDate)
    );
}

/** Returns the top `n` upcoming events sorted by date (default 5). */
export function getTopUpcomingEvents(n = 5) {
  return getUpcomingEvents().slice(0, n);
}

/** Finds a single event by id. Returns undefined if not found. */
export function getEventById(id) {
  return mockEvents.find((e) => String(e.id) === String(id));
}

/**
 * Returns events whose category matches the given slug.
 * Slugs are lowercased, spaces → hyphens, & → dropped.
 * e.g.  "food-drinks"  matches  "Food & Drinks"
 */
export function getEventsByCategory(slug) {
  return mockEvents.filter(
    (e) => categoryToSlug(e.category) === slug.toLowerCase()
  );
}

/** Converts a category name to a URL slug. */
export function categoryToSlug(name) {
  return (name || "")
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Converts a URL slug back to a human-readable label. */
export function slugToLabel(slug) {
  const map = {
    music: "Music",
    technology: "Technology",
    business: "Business",
    workshops: "Workshops",
    "food-drinks": "Food & Drinks",
    entertainment: "Entertainment",
    wellness: "Wellness",
    social: "Social",
    adventure: "Adventure",
  };
  return map[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** All canonical categories derived from the dataset. */
export const CATEGORIES = [
  { slug: "music", label: "Music" },
  { slug: "technology", label: "Technology" },
  { slug: "business", label: "Business" },
  { slug: "workshops", label: "Workshops" },
  { slug: "food-drinks", label: "Food & Drinks" },
  { slug: "entertainment", label: "Entertainment" },
  { slug: "wellness", label: "Wellness" },
];
