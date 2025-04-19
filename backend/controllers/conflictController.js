// controllers/conflictController.js
const Conflict = require("../models/conflict");
const Booking = require("../models/bookings");

exports.createConflict = async (req, res) => {
  try {
    const conflict = await Conflict.create(req.body);
    res.status(201).json(conflict);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getConflicts = async (req, res) => {
    try {
      const conflicts = await Conflict.findAll();
      res.status(200).json(conflicts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  // Update Conflict
exports.updateConflict = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const conflict = await Conflict.findByPk(id);
    if (!conflict) {
      return res.status(404).json({ error: "Conflict not found" });
    }

    await conflict.update(updates);
    res.status(200).json(conflict);
  } catch (error) {
    console.error("Error updating conflict:", error);
    res.status(500).json({ error: "Error updating conflict" });
  }
};


// Resolve Conflict
exports.resolveConflict = async (req, res) => {
  const { conflictId } = req.params;
  const { selectedConflict, conflictingBookings } = req.body;

  let transaction;
  try {
    // Start a transaction
    transaction = await Booking.sequelize.transaction();

    // Step 1: Update the conflict status to "Resolved"
    const conflict = await Conflict.findByPk(conflictId, { transaction });
    if (!conflict) {
      await transaction.rollback();
      return res.status(404).json({ error: "Conflict not found" });
    }

    await conflict.update({ Status: "Resolved" }, { transaction });

    // Step 2: Move the resolved conflict data to the bookings table
    const newBooking = {
      RoomID: selectedConflict.RoomID,
      FacultyName: selectedConflict.FacultyName,
      FacultyID: selectedConflict.FacultyID,
      CourseCode: selectedConflict.CourseCode,
      Purpose: selectedConflict.Purpose,
      ResourceNeeds: selectedConflict.ResourceNeeds,
      Date: selectedConflict.Date,
      FromTime: selectedConflict.FromTime,
      ToTime: selectedConflict.ToTime,
      Status: "Pending", // Default status for new bookings
    };

    // Generate a new BookingID
    const latestBooking = await Booking.findOne({
      order: [['BookingID', 'DESC']],
      attributes: ['BookingID'],
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    let newBID = "BID1";
    if (latestBooking && latestBooking.BookingID) {
      const lastNumericId = parseInt(latestBooking.BookingID.replace("BID", ""), 10);
      newBID = `BID${lastNumericId + 1}`;
    }

    newBooking.BookingID = newBID;

    // Create the new booking
    await Booking.create(newBooking, { transaction });

    // Step 3: Update conflicting bookings (if any)
    for (const booking of conflictingBookings) {
      const existingBooking = await Booking.findOne({
        where: { BookingID: booking.BookingID },
        transaction,
      });

      if (existingBooking) {
        await existingBooking.update(booking, { transaction });
      }
    }

    // Commit the transaction
    await transaction.commit();

    res.status(200).json({ message: "Conflict resolved successfully" });
  } catch (error) {
    console.error("Error resolving conflict:", error);

    // Rollback the transaction in case of an error
    if (transaction) await transaction.rollback();

    res.status(500).json({ error: "Error resolving conflict" });
  }
};

