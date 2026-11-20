const Booking = require('../models/Booking');
const Event = require('../models/Event');

// Register (book) for an event — no OTP, no payment
exports.bookEvent = async (req, res) => {
    try {
        const { eventId } = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.availableSeats <= 0) return res.status(400).json({ message: 'No seats available' });

        // Prevent duplicate bookings
        const existingBooking = await Booking.findOne({ userId: req.user.id, eventId });
        if (existingBooking && existingBooking.status !== 'cancelled') {
            return res.status(400).json({ message: 'You have already registered for this event' });
        }

        const booking = await Booking.create({
            userId: req.user.id,
            eventId,
            status: 'confirmed'
        });

        // Deduct available seat
        event.availableSeats -= 1;
        await event.save();

        res.status(201).json({ message: 'Successfully registered for event!', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get bookings (user sees their own, admin sees all)
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = req.user.role === 'admin'
            ? await Booking.find().populate('eventId').populate('userId', 'name email').sort({ createdAt: -1 })
            : await Booking.find({ userId: req.user.id }).populate('eventId').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Only the booking owner or admin can cancel
        if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (booking.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

        const wasConfirmed = booking.status === 'confirmed';
        booking.status = 'cancelled';
        await booking.save();

        // Restore the seat if booking was confirmed
        if (wasConfirmed) {
            const event = await Event.findById(booking.eventId);
            if (event) {
                event.availableSeats += 1;
                await event.save();
            }
        }

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
