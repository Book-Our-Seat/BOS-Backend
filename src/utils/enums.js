const BookingStatus = Object.freeze({
    "BOOKED": "Booked",
    "FAILED": "Failed",
    "PENDING": "Pending",
    "FINISHED": "Finished",
    "INVALID": "Invalid"
})

const PaymentStatus = Object.freeze({
    "INITIATED": "Initiated",
    "PENDING": "Pending",
    "SUCCESS": "Success",
    "FAILURE": "Failure",
    "INVALID": "Invalid",
})

const ShowSeatStatus = Object.freeze({
    "AVAILABLE": "Available",
    "UNAVAILABLE": "Unavailable",
    "RESERVED": "Reserved",
    "SOLD": "Sold"
})

module.exports = {BookingStatus, PaymentStatus, ShowSeatStatus}