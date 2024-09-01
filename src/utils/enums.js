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

const ShowSeatCategory = Object.freeze({
    "VIP": "Vip",
    "GENERAL": "General",
    "DELUXE": "Deluxe"
})

module.exports = {BookingStatus, PaymentStatus, ShowSeatStatus, ShowSeatCategory}