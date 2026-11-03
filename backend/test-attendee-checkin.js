/**
 * Comprehensive test script for Attendee Management & Check-In feature
 *
 * Tests:
 *  1. Fetch attendee lists for an event
 *  2. Fetch attendees with search filter
 *  3. Fetch attendees with pagination
 *  4. Fetch attendee details by ID
 *  5. Generate/retrieve a QR code (by attendee ID)
 *  6. Retrieve QR code by booking ID
 *  7. Successfully check in an attendee using a valid QR token
 *  8. Reject an invalid QR token
 *  9. Reject a duplicate check-in
 * 10. Reject QR code from another event
 * 11. Unauthorized user cannot access attendee list
 * 12. Unauthenticated request rejected
 * 13. Manually add an attendee
 * 14. Check-in statistics are accurate
 * 15. Remove/cancel attendee registration
 * 16. Reject cancelled registration QR / check-in
 * 17. Concurrent check-in protection
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const API_BASE = `http://localhost:${process.env.PORT || 5001}/api/v1`;

let organizerToken = null;
let userToken = null;
let testEventId = null;
let testTicketTypeId = null;
let testAttendeeId = null;
let testQrToken = null;
let testBookingId = null;
let secondEventId = null;
let manualAttendeeId = null;

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
  const data = await res.json();
  return { status: res.status, data };
}

async function setupTestData() {
  console.log('\n🔧 Setting up test data...\n');

  // Login as seeded organizer
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

  // Login as seeded user
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

  // Get existing events for the organizer
  res = await api('GET', '/events?limit=100');
  const events = res.data.data?.events || [];
  if (events.length < 2) {
    console.error('  ✗ Need at least 2 seeded events. Run the seed script first.');
    process.exit(1);
  }

  testEventId = events[0].id;
  secondEventId = events[1].id;

  // Get ticket types for the first event
  res = await api('GET', `/tickets/event/${testEventId}`);
  const tickets = res.data.data?.tickets || [];
  if (tickets.length === 0) {
    console.error('  ✗ No ticket types found for test event');
    process.exit(1);
  }
  testTicketTypeId = tickets[0].id;
  console.log(`  ✓ Using event: ${testEventId} with ticket: ${testTicketTypeId}`);
  console.log(`  ✓ Second event: ${secondEventId}`);

  // Create a booking as the regular user
  res = await api('POST', '/bookings', {
    eventId: testEventId,
    ticketTypeId: testTicketTypeId,
    quantity: 2,
    attendeeName: 'Test Attendee Alpha',
    attendeeEmail: 'user@eventnest.com',
    phone: '9876543210',
  }, userToken);

  if (res.status === 201 || res.status === 200) {
    testBookingId = res.data.data?.booking?.id;
    const attendees = res.data.data?.booking?.Attendee;
    if (attendees && attendees.length > 0) {
      testAttendeeId = attendees[0].id;
      testQrToken = attendees[0].qrToken;
      console.log(`  ✓ Booking created: ${testBookingId} with ${attendees.length} attendees`);
      console.log(`  ✓ Attendee: ${testAttendeeId}, QR token: ${testQrToken ? 'present' : 'MISSING'}`);
    }
  } else {
    console.error('  ✗ Booking failed:', res.data.message);
    process.exit(1);
  }

  console.log('');
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('  ATTENDEE MANAGEMENT & CHECK-IN — TEST SUITE');
  console.log('='.repeat(60));

  await setupTestData();

  // ─── 1. Fetch attendee list ───
  {
    const res = await api('GET', `/attendees/events/${testEventId}`, null, organizerToken);
    const passed = res.status === 200 && Array.isArray(res.data.data?.attendees);
    log('1. Fetch attendee list for event', passed,
      `${res.data.data?.attendees?.length || 0} attendees`);
  }

  // ─── 2. Search filter ───
  {
    const res = await api('GET', `/attendees/events/${testEventId}?search=Alpha`, null, organizerToken);
    const passed = res.status === 200 && (res.data.data?.attendees?.length ?? 0) >= 1;
    log('2. Fetch attendees with search filter', passed,
      `${res.data.data?.attendees?.length || 0} matches`);
  }

  // ─── 3. Pagination ───
  {
    const res = await api('GET', `/attendees/events/${testEventId}?page=1&limit=1`, null, organizerToken);
    const p = res.data.data?.pagination;
    const passed = res.status === 200 && p && p.totalRecords >= 2 && p.pageSize === 1;
    log('3. Fetch attendees with pagination', passed,
      `page=${p?.currentPage}, total=${p?.totalRecords}, pageSize=${p?.pageSize}`);
  }

  // ─── 4. Attendee details ───
  {
    const res = await api('GET', `/attendees/${testAttendeeId}`, null, organizerToken);
    const a = res.data.data?.attendee;
    const passed = res.status === 200 && a?.attendeeName && a?.attendeeEmail && a?.eventId === testEventId;
    log('4. Fetch attendee details by ID', passed,
      `name=${a?.attendeeName}, email=${a?.attendeeEmail}`);
  }

  // ─── 5. QR code by attendee ID ───
  {
    const res = await api('GET', `/attendees/registrations/${testAttendeeId}/qr`, null, userToken);
    const passed = res.status === 200 && res.data.data?.qrCode && res.data.data?.qrToken;
    if (passed && res.data.data.qrToken) testQrToken = res.data.data.qrToken;
    log('5. Retrieve QR code by attendee ID', passed,
      `qrToken=${res.data.data?.qrToken ? 'present' : 'missing'}, qrCode=${res.data.data?.qrCode ? 'present (data URL)' : 'missing'}`);
  }

  // ─── 6. QR code by booking ID ───
  {
    const res = await api('GET', `/attendees/registrations/${testBookingId}/qr`, null, userToken);
    const passed = res.status === 200 && res.data.data?.qrCode;
    log('6. Retrieve QR code by booking ID', passed);
  }

  // ─── 7. Successful check-in ───
  {
    const res = await api('POST', `/attendees/events/${testEventId}/check-in/verify`,
      { qrToken: testQrToken }, organizerToken);
    const passed = res.status === 200 && res.data.data?.checkInTime;
    log('7. Check-in with valid QR token', passed,
      `checkInTime=${res.data.data?.checkInTime}`);
  }

  // ─── 8. Reject invalid token ───
  {
    const res = await api('POST', `/attendees/events/${testEventId}/check-in/verify`,
      { qrToken: 'totally_invalid_token_xyz' }, organizerToken);
    const passed = res.status === 404;
    log('8. Reject invalid QR token', passed, `status=${res.status}`);
  }

  // ─── 9. Reject duplicate check-in ───
  {
    const res = await api('POST', `/attendees/events/${testEventId}/check-in/verify`,
      { qrToken: testQrToken }, organizerToken);
    const passed = res.status === 409;
    log('9. Reject duplicate check-in', passed,
      `status=${res.status}, msg=${res.data.message}`);
  }

  // ─── 10. Reject QR from another event ───
  {
    // Get the second (unchecked) attendee from the booking
    const listRes = await api('GET', `/attendees/events/${testEventId}?checkInStatus=false`, null, organizerToken);
    const unchecked = listRes.data.data?.attendees?.find(a => !a.checkInStatus);
    if (unchecked) {
      const qrRes = await api('GET', `/attendees/registrations/${unchecked.id}/qr`, null, organizerToken);
      const otherQr = qrRes.data.data?.qrToken;
      if (otherQr) {
        const res = await api('POST', `/attendees/events/${secondEventId}/check-in/verify`,
          { qrToken: otherQr }, organizerToken);
        const passed = res.status === 400 && res.data.message.includes('does not belong');
        log('10. Reject QR from another event', passed,
          `status=${res.status}, msg=${res.data.message}`);
      } else {
        log('10. Reject QR from another event', false, 'Could not get QR');
      }
    } else {
      log('10. Reject QR from another event', false, 'No unchecked attendee found');
    }
  }

  // ─── 11. Unauthorized access ───
  {
    const res = await api('GET', `/attendees/events/${testEventId}`, null, userToken);
    const passed = res.status === 403;
    log('11. Unauthorized user cannot access attendee list', passed,
      `status=${res.status}`);
  }

  // ─── 12. Unauthenticated ───
  {
    const res = await api('GET', `/attendees/events/${testEventId}`);
    const passed = res.status === 401;
    log('12. Unauthenticated request rejected', passed, `status=${res.status}`);
  }

  // ─── 13. Manually add attendee ───
  {
    const res = await api('POST', `/attendees/events/${testEventId}`, {
      attendeeName: 'Manual Attendee Beta',
      attendeeEmail: 'manual_beta@test.com',
      phone: '1234567890',
      ticketTypeId: testTicketTypeId,
    }, organizerToken);
    const passed = res.status === 201 && res.data.data?.attendee;
    manualAttendeeId = res.data.data?.attendee?.id;
    log('13. Manually add an attendee', passed,
      `id=${manualAttendeeId}`);
  }

  // ─── 14. Check-in statistics ───
  {
    const res = await api('GET', `/attendees/events/${testEventId}/check-in/stats`, null, organizerToken);
    const s = res.data.data;
    const passed = res.status === 200 &&
      s?.totalRegistered >= 2 &&
      s?.totalCheckedIn >= 1 &&
      s?.totalNotCheckedIn >= 1 &&
      typeof s?.checkInPercentage === 'number';
    log('14. Check-in statistics are accurate', passed,
      `reg=${s?.totalRegistered}, in=${s?.totalCheckedIn}, out=${s?.totalNotCheckedIn}, %=${s?.checkInPercentage}`);
  }

  // ─── 15. Remove / cancel attendee ───
  {
    if (manualAttendeeId) {
      const res = await api('DELETE', `/attendees/${manualAttendeeId}`, null, organizerToken);
      const passed = res.status === 200;
      log('15. Remove/cancel attendee registration', passed,
        `msg=${res.data.message}`);
    } else {
      log('15. Remove/cancel attendee registration', false, 'No attendee to remove');
    }
  }

  // ─── 16. Cancelled registration → QR rejected ───
  {
    if (manualAttendeeId) {
      const qrRes = await api('GET', `/attendees/registrations/${manualAttendeeId}/qr`, null, organizerToken);
      if (qrRes.status === 400) {
        log('16. Reject cancelled registration QR retrieval', true,
          `status=${qrRes.status}, msg=${qrRes.data.message}`);
      } else if (qrRes.data.data?.qrToken) {
        const res = await api('POST', `/attendees/events/${testEventId}/check-in/verify`,
          { qrToken: qrRes.data.data.qrToken }, organizerToken);
        const passed = res.status === 400 && res.data.message.toLowerCase().includes('cancelled');
        log('16. Reject cancelled registration check-in', passed,
          `status=${res.status}, msg=${res.data.message}`);
      } else {
        log('16. Reject cancelled registration', false, 'Unexpected state');
      }
    } else {
      log('16. Reject cancelled registration', false, 'No cancelled attendee');
    }
  }

  // ─── 17. Concurrent check-in protection ───
  {
    const listRes = await api('GET', `/attendees/events/${testEventId}?checkInStatus=false`, null, organizerToken);
    const unchecked = (listRes.data.data?.attendees || []).find(a => !a.checkInStatus && a.status !== 'CANCELLED');
    if (unchecked) {
      const qrRes = await api('GET', `/attendees/registrations/${unchecked.id}/qr`, null, organizerToken);
      const token = qrRes.data.data?.qrToken;
      if (token) {
        const [r1, r2] = await Promise.all([
          api('POST', `/attendees/events/${testEventId}/check-in/verify`, { qrToken: token }, organizerToken),
          api('POST', `/attendees/events/${testEventId}/check-in/verify`, { qrToken: token }, organizerToken),
        ]);
        const successes = [r1, r2].filter(r => r.status === 200).length;
        const rejects = [r1, r2].filter(r => r.status === 409).length;
        const passed = successes === 1 && rejects === 1;
        log('17. Concurrent check-in protection', passed,
          `successes=${successes}, rejects=${rejects}`);
      } else {
        log('17. Concurrent check-in protection', false, 'No QR token');
      }
    } else {
      log('17. Concurrent check-in protection', false, 'No unchecked attendee');
    }
  }

  // ─── Summary ───
  console.log('\n' + '='.repeat(60));
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`  RESULTS: ${passed} passed, ${failed} failed, ${results.length} total`);
  console.log('='.repeat(60));

  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  ❌ ${r.testName}: ${r.details}`);
    });
  }
  console.log('');
}

runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
