/**
 * Slot Engine - Computes available time slots for a given date and service duration.
 * Prevents double-booking by checking existing appointments.
 */

const { parse, addMinutes, format, isAfter, isBefore } = require('date-fns');

/**
 * Generate all possible time slots for a day
 * @param {string} openTime - "HH:MM"
 * @param {string} closeTime - "HH:MM"
 * @param {number} slotDuration - minutes
 * @param {number} serviceDuration - minutes required for the service
 * @returns {string[]} array of slot start times e.g. ["09:00","09:30",...]
 */
function generateSlots(openTime, closeTime, slotDuration, serviceDuration) {
    const slots = [];
    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);

    const [openH, openM] = openTime.split(':').map(Number);
    const [closeH, closeM] = closeTime.split(':').map(Number);

    let current = new Date(baseDate);
    current.setHours(openH, openM, 0, 0);

    const close = new Date(baseDate);
    close.setHours(closeH, closeM, 0, 0);

    while (true) {
        const slotEnd = addMinutes(current, serviceDuration);
        if (isAfter(slotEnd, close)) break;
        slots.push(format(current, 'HH:mm'));
        current = addMinutes(current, slotDuration);
    }

    return slots;
}

/**
 * Filter out already-booked slots
 * @param {string[]} allSlots - all possible HH:MM slots
 * @param {Array} existingAppointments - appointments for the date
 * @param {number} serviceDuration - new service duration in minutes
 * @returns {string[]} available slots
 */
function filterAvailableSlots(allSlots, existingAppointments, serviceDuration) {
    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);

    const bookedRanges = existingAppointments
        .filter((a) => a.status !== 'cancelled')
        .map((a) => {
            const [sh, sm] = a.timeSlot.split(':').map(Number);
            const [eh, em] = a.endTime.split(':').map(Number);
            const start = new Date(baseDate);
            start.setHours(sh, sm, 0, 0);
            const end = new Date(baseDate);
            end.setHours(eh, em, 0, 0);
            return { start, end };
        });

    return allSlots.filter((slot) => {
        const [sh, sm] = slot.split(':').map(Number);
        const slotStart = new Date(baseDate);
        slotStart.setHours(sh, sm, 0, 0);
        const slotEnd = addMinutes(slotStart, serviceDuration);

        const overlaps = bookedRanges.some(
            (range) =>
                isBefore(slotStart, range.end) && isAfter(slotEnd, range.start)
        );
        return !overlaps;
    });
}

module.exports = { generateSlots, filterAvailableSlots };
