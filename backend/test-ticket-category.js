/**
 * Comprehensive test script for Ticket Category Management & Capacity Validation
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const API_BASE = `http://localhost:${process.env.PORT || 5001}/api/v1`;

let organizerToken = null;
let userToken = null;
let secondUserToken = null;
let testEventId = null;
let secondEventId = null;

let createdCategoryId = null;
let emptyCategoryId = null;

const results = [];

function log(testName, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  results.push({ testName, passed, details });
  console.log(`${status}: ${testName}${details ? ' — ' + details : ''}`);
}

async function api(method, endpoint, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${endpoint}`, opts);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function setupTestData() {
  console.log('\n🔧 Setting up test credentials and base data...\n');

  // 1. Login as seeded organizer
  let res = await api('POST', '/auth/login', {
    email: 'organizer@eventnest.com',
    password: 'Password@123',
  });
  if (res.status === 200) {
    organizerToken = res.data.data?.token;
    console.log('  ✓ Organizer logged in');
  } else {
    console.error('  ✗ Organizer login failed:', res.data.message);
    process.exit(1);
  }

  // 2. Login as seeded user
  res = await api('POST', '/auth/login', {
    email: 'user@eventnest.com',
    password: 'Password@123',
  });
  if (res.status === 200) {
    userToken = res.data.data?.token;
    console.log('  ✓ User logged in');
  } else {
    console.error('  ✗ User login failed:', res.data.message);
    process.exit(1);
  }

  // 3. Register/Login a second user for concurrency tests
  res = await api('POST', '/auth/register', {
    name: 'Concurrent Tester',
    email: `concurrent_${Date.now()}@test.com`,
    password: 'Password@123',
    role: 'USER',
  });
  if (res.status === 201 || res.status === 200) {
    secondUserToken = res.data.data?.token;
    console.log('  ✓ Second user registered');
  } else {
    secondUserToken = userToken;
  }

  // 4. Create a dedicated fresh test event for clean testing
  const start = new Date(Date.now() + 86400000 * 10);
  const end = new Date(Date.now() + 86400000 * 10 + 3600000 * 4);

  res = await api('POST', '/events', {
    title: `Ticket Category Test Event ${Date.now()}`,
    description: 'An event created to test ticket category management and capacity validation.',
    format: 'ONLINE',
    totalCapacity: 500,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    status: 'PUBLISHED',
  }, organizerToken);

  if (res.status === 201) {
    testEventId = res.data.data?.event?.id;
    console.log(`  ✓ Dedicated test event created: ${testEventId}`);
  } else {
    // Fallback to existing events
    const evRes = await api('GET', '/events?limit=2');
    testEventId = evRes.data.data?.events[0]?.id;
    console.log(`  ✓ Using fallback event: ${testEventId}`);
  }

  console.log('');
}

async function runTests() {
  console.log('='.repeat(70));
  console.log('  TICKET CATEGORY MANAGEMENT & CAPACITY VALIDATION — TEST SUITE');
  console.log('='.repeat(70));

  await setupTestData();

  // ══════════════════════════════════════════════════════════════════════════
  // GROUP 1: CREATE TICKET CATEGORY & INPUT VALIDATION
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n--- 1. CREATE TICKET CATEGORY TESTS ---');

  // Test 1: Successfully create a valid ticket category
  {
    const res = await api('POST', `/tickets/event/${testEventId}`, {
      name: 'Early Bird Tier',
      price: 299.50,
      capacity: 50,
      description: 'Special discounted early bird access with limited availability',
      perks: 'Fast-track entry, complimentary welcome drink',
    }, organizerToken);

    const ticket = res.data.data?.ticket || res.data.data?.ticketType;
    const passed = res.status === 201 && ticket && ticket.name === 'Early Bird Tier' && ticket.price === 299.50 && ticket.totalQuantity === 50 && ticket.availableQuantity === 50;
    if (passed) createdCategoryId = ticket.id;
    log('1. Successfully create a valid ticket category', passed,
      `status=${res.status}, id=${createdCategoryId}, name=${ticket?.name}, capacity=${ticket?.totalQuantity}`);
  }

  // Test 2: Successfully create via POST /tickets (with eventId in body)
  {
    const res = await api('POST', '/tickets', {
      eventId: testEventId,
      name: 'VIP Experience Pass',
      price: 999,
      totalQuantity: 20,
      description: 'VIP lounge access and all-access pass',
      perks: 'VIP Lounge, Meet & Greet, Exclusive Merch',
    }, organizerToken);

    const ticket = res.data.data?.ticket;
    const passed = res.status === 201 && ticket && ticket.name === 'VIP Experience Pass';
    log('2. Create category via POST /tickets (eventId in body)', passed,
      `status=${res.status}, id=${ticket?.id}`);
  }

  // Test 3: Create category with zero price (free ticket category)
  {
    const res = await api('POST', `/tickets/event/${testEventId}`, {
      name: 'Community Free Pass',
      price: 0,
      capacity: 30,
      description: 'Free access for students and community members',
    }, organizerToken);

    const ticket = res.data.data?.ticket;
    const passed = res.status === 201 && ticket && ticket.price === 0;
    log('3. Create free category (price = 0)', passed,
      `status=${res.status}, price=${ticket?.price}`);
  }

  // Test 4: Create empty category to be deleted later
  {
    const res = await api('POST', `/tickets/event/${testEventId}`, {
      name: 'Temporary Category',
      price: 150,
      capacity: 10,
    }, organizerToken);

    const ticket = res.data.data?.ticket;
    const passed = res.status === 201 && ticket;
    if (passed) emptyCategoryId = ticket.id;
    log('4. Create category for deletion test', passed, `id=${emptyCategoryId}`);
  }

  // Test 5: Prevent duplicate category name in the same event
  {
    const res = await api('POST', `/tickets/event/${testEventId}`, {
      name: 'early bird tier', // lower case check
      price: 350,
      capacity: 25,
    }, organizerToken);

    const passed = res.status === 400 && res.data.message.toLowerCase().includes('already exists');
    log('5. Reject duplicate category name (case-insensitive)', passed,
      `status=${res.status}, msg=${res.data.message}`);
  }

  // Test 6: Reject missing category name
  {
    const res = await api('POST', `/tickets/event/${testEventId}`, {
      price: 100,
      capacity: 50,
    }, organizerToken);

    const passed = res.status === 400 && res.data.message.toLowerCase().includes('name is required');
    log('6. Reject missing category name', passed, `status=${res.status}`);
  }

  // Test 7: Reject empty/whitespace category name
  {
    const res = await api('POST', `/tickets/event/${testEventId}`, {
      name: '   ',
      price: 100,
      capacity: 50,
    }, organizerToken);

    const passed = res.status === 400;
    log('7. Reject empty/whitespace category name', passed, `status=${res.status}`);
  }

  // Test 8: Reject missing price
  {
    const res = await api('POST', `/tickets/event/${testEventId}`, {
      name: 'Invalid Price Category',
      capacity: 50,
    }, organizerToken);

    const passed = res.status === 400 && res.data.message.toLowerCase().includes('price is required');
    log('8. Reject missing price', passed, `status=${res.status}`);
  }

  // Test 9: Reject negative price
  {
    const res = await api('POST', `/tickets/event/${testEventId}`, {
      name: 'Negative Price Category',
      price: -50,
      capacity: 50,
    }, organizerToken);

    const passed = res.status === 400 && res.data.message.toLowerCase().includes('non-negative');
    log('9. Reject negative price', passed, `status=${res.status}`);
  }

  // Test 10: Reject missing capacity
  {
    const res = await api('POST', `/tickets/event/${testEventId}`, {
      name: 'No Capacity Category',
      price: 100,
    }, organizerToken);

    const passed = res.status === 400 && res.data.message.toLowerCase().includes('capacity is required');
    log('10. Reject missing capacity', passed, `status=${res.status}`);
  }

  // Test 11: Reject zero or negative capacity
  {
    const res1 = await api('POST', `/tickets/event/${testEventId}`, {
      name: 'Zero Capacity Category',
      price: 100,
      capacity: 0,
    }, organizerToken);

    const res2 = await api('POST', `/tickets/event/${testEventId}`, {
      name: 'Negative Capacity Category',
      price: 100,
      capacity: -10,
    }, organizerToken);

    const passed = res1.status === 400 && res2.status === 400;
    log('11. Reject zero or negative capacity', passed,
      `res1=${res1.status}, res2=${res2.status}`);
  }

  // Test 12: Reject non-existent event ID
  {
    const res = await api('POST', '/tickets/event/00000000-0000-0000-0000-000000000000', {
      name: 'Ghost Event Category',
      price: 100,
      capacity: 50,
    }, organizerToken);

    const passed = res.status === 404;
    log('12. Reject non-existent event ID', passed, `status=${res.status}`);
  }

  // Test 13: Reject unauthorized user (non-organizer)
  {
    const res = await api('POST', `/tickets/event/${testEventId}`, {
      name: 'Hacker Pass',
      price: 10,
      capacity: 10,
    }, userToken);

    const passed = res.status === 403;
    log('13. Reject unauthorized user (USER role cannot create category)', passed,
      `status=${res.status}`);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // GROUP 2: GET TICKET CATEGORIES
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n--- 2. GET TICKET CATEGORY TESTS ---');

  // Test 14: Get all categories for an event
  {
    const res = await api('GET', `/tickets/event/${testEventId}`);
    const tickets = res.data.data?.tickets;
    const passed = res.status === 200 && Array.isArray(tickets) && tickets.length >= 3;
    log('14. Retrieve all ticket categories for event', passed,
      `count=${tickets?.length}`);
  }

  // Test 15: Get ticket category by ID
  {
    const res = await api('GET', `/tickets/${createdCategoryId}`);
    const ticket = res.data.data?.ticket || res.data.data?.ticketType;
    const passed = res.status === 200 && ticket && ticket.id === createdCategoryId && ticket.name === 'Early Bird Tier';
    log('15. Retrieve single ticket category by ID', passed,
      `name=${ticket?.name}, total=${ticket?.totalQuantity}, available=${ticket?.availableQuantity}`);
  }

  // Test 16: Get non-existent ticket category by ID
  {
    const res = await api('GET', '/tickets/00000000-0000-0000-0000-000000000000');
    const passed = res.status === 404;
    log('16. Reject non-existent ticket category ID', passed, `status=${res.status}`);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // GROUP 3: UPDATE TICKET CATEGORY
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n--- 3. UPDATE TICKET CATEGORY TESTS ---');

  // Test 17: Successfully update category name, price, perks
  {
    const res = await api('PUT', `/tickets/${createdCategoryId}`, {
      name: 'Super Early Bird VIP',
      price: 349.99,
      perks: 'Front row seats, swag kit, priority entry',
    }, organizerToken);

    const ticket = res.data.data?.ticket;
    const passed = res.status === 200 && ticket && ticket.name === 'Super Early Bird VIP' && ticket.price === 349.99;
    log('17. Successfully update category details (name, price, perks)', passed,
      `name=${ticket?.name}, price=${ticket?.price}`);
  }

  // Test 18: Successfully update capacity (increase)
  {
    const res = await api('PATCH', `/tickets/${createdCategoryId}`, {
      capacity: 60,
    }, organizerToken);

    const ticket = res.data.data?.ticket;
    const passed = res.status === 200 && ticket && ticket.totalQuantity === 60 && ticket.availableQuantity === 60;
    log('18. Successfully increase category capacity', passed,
      `total=${ticket?.totalQuantity}, available=${ticket?.availableQuantity}`);
  }

  // Test 19: Reject empty name update
  {
    const res = await api('PUT', `/tickets/${createdCategoryId}`, {
      name: '   ',
    }, organizerToken);

    const passed = res.status === 400 && res.data.message.toLowerCase().includes('cannot be empty');
    log('19. Reject empty name on update', passed, `status=${res.status}`);
  }

  // Test 20: Reject duplicate name with another category in the same event
  {
    const res = await api('PUT', `/tickets/${createdCategoryId}`, {
      name: 'VIP Experience Pass', // already used by another category
    }, organizerToken);

    const passed = res.status === 400 && res.data.message.toLowerCase().includes('already exists');
    log('20. Reject updating to existing category name in same event', passed,
      `status=${res.status}, msg=${res.data.message}`);
  }

  // Test 21: Reject invalid price update
  {
    const res = await api('PUT', `/tickets/${createdCategoryId}`, {
      price: -20,
    }, organizerToken);

    const passed = res.status === 400;
    log('21. Reject negative price on update', passed, `status=${res.status}`);
  }

  // Test 22: Reject update for non-existent category
  {
    const res = await api('PUT', '/tickets/00000000-0000-0000-0000-000000000000', {
      name: 'Ghost Update',
    }, organizerToken);

    const passed = res.status === 404;
    log('22. Reject update for non-existent category ID', passed, `status=${res.status}`);
  }

  // Test 23: Reject unauthorized update by non-organizer
  {
    const res = await api('PUT', `/tickets/${createdCategoryId}`, {
      name: 'Hacked Category',
    }, userToken);

    const passed = res.status === 403;
    log('23. Reject unauthorized update by regular user', passed, `status=${res.status}`);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // GROUP 4: TICKET CAPACITY VALIDATION & BOOKING ENFORCEMENT
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n--- 4. TICKET CAPACITY VALIDATION & CONCURRENCY TESTS ---');

  let smallCapacityCategoryId = null;

  // Create a category with small capacity = 5 specifically to test capacity limits
  {
    const res = await api('POST', `/tickets/event/${testEventId}`, {
      name: 'Limited Exclusive Tier',
      price: 199,
      capacity: 5,
      description: 'Strict limit of 5 seats',
    }, organizerToken);

    smallCapacityCategoryId = res.data.data?.ticket?.id;
    console.log(`  ✓ Created limited category with capacity 5: ${smallCapacityCategoryId}`);
  }

  // Test 24: Successfully book tickets within available capacity (book 3 of 5)
  {
    const res = await api('POST', '/bookings', {
      eventId: testEventId,
      ticketTypeId: smallCapacityCategoryId,
      quantity: 3,
      attendeeName: 'Primary Attendee',
      attendeeEmail: 'user@eventnest.com',
    }, userToken);

    const passed = res.status === 201 && res.data.data?.booking?.quantity === 3;
    log('24. Book 3 tickets within available capacity (5 available)', passed,
      `status=${res.status}, booked=3`);
  }

  // Test 25: Verify remaining available capacity is now 2
  {
    const res = await api('GET', `/tickets/${smallCapacityCategoryId}`);
    const t = res.data.data?.ticket;
    const passed = res.status === 200 && t.totalQuantity === 5 && t.availableQuantity === 2 && t.soldQuantity === 3;
    log('25. Verify available capacity decremented to 2 (5 total - 3 sold)', passed,
      `total=${t?.totalQuantity}, available=${t?.availableQuantity}, sold=${t?.soldQuantity}`);
  }

  // Test 26: Maximum capacity scenario - attempt to book more than remaining (request 3 when only 2 available)
  {
    const res = await api('POST', '/bookings', {
      eventId: testEventId,
      ticketTypeId: smallCapacityCategoryId,
      quantity: 3,
      attendeeName: 'Over Limit Attendee',
      attendeeEmail: 'user@eventnest.com',
    }, userToken);

    const passed = res.status === 400 && (res.data.message.includes('Only 2 ticket(s) remaining') || res.data.message.toLowerCase().includes('not enough tickets'));
    log('26. Prevent booking exceeding remaining capacity (requested 3, only 2 left)', passed,
      `status=${res.status}, msg=${res.data.message}`);
  }

  // Test 27: Book the remaining 2 tickets (reaching 100% capacity)
  {
    const res = await api('POST', '/bookings', {
      eventId: testEventId,
      ticketTypeId: smallCapacityCategoryId,
      quantity: 2,
      attendeeName: 'Last Attendee',
      attendeeEmail: 'user@eventnest.com',
    }, userToken);

    const passed = res.status === 201;
    log('27. Book remaining 2 tickets to reach maximum capacity', passed,
      `status=${res.status}`);
  }

  // Test 28: Sold out scenario - booking rejected when category reached maximum capacity
  {
    const res = await api('POST', '/bookings', {
      eventId: testEventId,
      ticketTypeId: smallCapacityCategoryId,
      quantity: 1,
      attendeeName: 'Late Attendee',
      attendeeEmail: 'user@eventnest.com',
    }, userToken);

    const passed = res.status === 400 && (res.data.message.toLowerCase().includes('maximum capacity') || res.data.message.toLowerCase().includes('not enough tickets'));
    log('28. Reject booking when category has reached maximum capacity (0 left)', passed,
      `status=${res.status}, msg=${res.data.message}`);
  }

  // Test 29: Capacity reduction validation - cannot reduce below already sold tickets (5 sold, attempt reduction to 4)
  {
    const res = await api('PUT', `/tickets/${smallCapacityCategoryId}`, {
      capacity: 4, // 5 tickets already booked!
    }, organizerToken);

    const passed = res.status === 400 && res.data.message.toLowerCase().includes('cannot reduce capacity to 4') && res.data.message.includes('5');
    log('29. Prevent reducing capacity below tickets already sold (attempt 4 when 5 sold)', passed,
      `status=${res.status}, msg=${res.data.message}`);
  }

  // Test 30: Capacity reduction to exactly tickets sold is allowed (5 total, 5 sold -> 0 available)
  {
    const res = await api('PUT', `/tickets/${smallCapacityCategoryId}`, {
      capacity: 5,
    }, organizerToken);

    const passed = res.status === 200 && res.data.data?.ticket?.totalQuantity === 5 && res.data.data?.ticket?.availableQuantity === 0;
    log('30. Allow setting capacity equal to tickets already sold', passed,
      `status=${res.status}, total=${res.data.data?.ticket?.totalQuantity}, available=${res.data.data?.ticket?.availableQuantity}`);
  }

  // Test 31: Increase capacity of sold out category (from 5 to 7 -> 2 available)
  {
    const res = await api('PUT', `/tickets/${smallCapacityCategoryId}`, {
      capacity: 7,
    }, organizerToken);

    const t = res.data.data?.ticket;
    const passed = res.status === 200 && t.totalQuantity === 7 && t.availableQuantity === 2;
    log('31. Expanding capacity of sold-out category makes new tickets available (7 total, 2 available)', passed,
      `status=${res.status}, total=${t?.totalQuantity}, available=${t?.availableQuantity}`);
  }

  // Test 32: Concurrent booking protection (atomic database check)
  {
    // There are currently 2 tickets available in smallCapacityCategoryId.
    // Send 3 concurrent requests simultaneously requesting 1 ticket each.
    // Exactly 2 must succeed, and 1 must be rejected.
    const promises = [
      api('POST', '/bookings', {
        eventId: testEventId,
        ticketTypeId: smallCapacityCategoryId,
        quantity: 1,
        attendeeName: 'Racer 1',
        attendeeEmail: 'user@eventnest.com',
      }, userToken),
      api('POST', '/bookings', {
        eventId: testEventId,
        ticketTypeId: smallCapacityCategoryId,
        quantity: 1,
        attendeeName: 'Racer 2',
        attendeeEmail: 'user@eventnest.com',
      }, secondUserToken),
      api('POST', '/bookings', {
        eventId: testEventId,
        ticketTypeId: smallCapacityCategoryId,
        quantity: 1,
        attendeeName: 'Racer 3',
        attendeeEmail: 'user@eventnest.com',
      }, userToken),
    ];

    const responses = await Promise.all(promises);
    const successes = responses.filter(r => r.status === 201).length;
    const rejects = responses.filter(r => r.status === 400).length;

    const passed = successes === 2 && rejects === 1;
    log('32. Concurrency protection: only 2 available tickets can be booked concurrently', passed,
      `successes=${successes}, rejects=${rejects}`);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // GROUP 5: DELETE TICKET CATEGORY & INTEGRITY PROTECTION
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n--- 5. DELETE TICKET CATEGORY TESTS ---');

  // Test 33: Prevent deletion of ticket category with active bookings
  {
    const res = await api('DELETE', `/tickets/${smallCapacityCategoryId}`, null, organizerToken);
    const passed = res.status === 400 && res.data.message.toLowerCase().includes('associated booking');
    log('33. Prevent deleting category with associated bookings', passed,
      `status=${res.status}, msg=${res.data.message}`);
  }

  // Test 34: Successfully delete an unused ticket category (emptyCategoryId)
  {
    const res = await api('DELETE', `/tickets/${emptyCategoryId}`, null, organizerToken);
    const passed = res.status === 200;
    log('34. Successfully delete an unused ticket category', passed,
      `status=${res.status}, msg=${res.data.message}`);
  }

  // Test 35: Verify deleted category no longer exists (404)
  {
    const res = await api('GET', `/tickets/${emptyCategoryId}`);
    const passed = res.status === 404;
    log('35. Verify deleted category is no longer found', passed,
      `status=${res.status}`);
  }

  // Test 36: Reject deleting non-existent category
  {
    const res = await api('DELETE', '/tickets/00000000-0000-0000-0000-000000000000', null, organizerToken);
    const passed = res.status === 404;
    log('36. Reject deleting non-existent category ID', passed, `status=${res.status}`);
  }

  // Test 37: Reject deleting category by unauthorized user
  {
    // Create another temporary category
    const tempRes = await api('POST', `/tickets/event/${testEventId}`, {
      name: 'Temp Category 2',
      price: 100,
      capacity: 10,
    }, organizerToken);
    const tempId = tempRes.data.data?.ticket?.id;

    const res = await api('DELETE', `/tickets/${tempId}`, null, userToken);
    const passed = res.status === 403;
    log('37. Reject deletion by unauthorized user', passed, `status=${res.status}`);

    // Clean up as organizer
    await api('DELETE', `/tickets/${tempId}`, null, organizerToken);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n' + '='.repeat(70));
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`  RESULTS: ${passed} passed, ${failed} failed, ${results.length} total`);
  console.log('='.repeat(70));

  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  ❌ ${r.testName}: ${r.details}`);
    });
    process.exit(1);
  } else {
    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!\n');
  }
}

runTests().catch(err => {
  console.error('Test suite runtime error:', err);
  process.exit(1);
});

