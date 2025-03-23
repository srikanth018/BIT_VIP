const { Op } = require('sequelize');
const Room = require('../models/room');
const Bookings = require('../models/bookings');
const Sequelize = require('sequelize');


const { Transaction } = require('sequelize');

exports.createBooking = async (req, res) => {
  let transaction;
  try {
    // Log the entire request body for debugging
    console.log("Request body:", req.body);

    const { RoomID, FacultyName, FacultyID, CourseCode, Purpose, ResourceNeeds, Date, FromTime, ToTime } = req.body;

    // Validate required fields
    if (!RoomID || !FacultyName || !FacultyID || !CourseCode || !Purpose || !ResourceNeeds || !Date || !FromTime || !ToTime) {
      console.log("Missing required fields");
      return res.status(400).json({ error: "All required fields must be filled in." });
    }

    // Start a transaction
    transaction = await Bookings.sequelize.transaction();

    // Fetch the latest BookingID within the transaction
    // Fetch the latest BookingID and lock the row for update
    const latestBooking = await Bookings.findOne({
      order: [['BookingID', 'DESC']],
      attributes: ['BookingID'],
      lock: Transaction.LOCK.UPDATE, // Lock for update to avoid concurrency
      transaction,
    });

    // Generate new BookingID
    let newBID = "BID1";
    if (latestBooking && latestBooking.BookingID) {
      const lastNumericId = parseInt(latestBooking.BookingID.replace("BID", ""), 10);
      newBID = `BID${lastNumericId + 1}`;
    }

    // Check if the new BookingID already exists and handle it
    const existingBooking = await Bookings.findOne({
      where: { BookingID: newBID },
      transaction,
    });

    if (existingBooking) {
      // Retry logic to generate a new BookingID
      return createBooking(req, res); // Recursively try again (or handle accordingly)
    }


    if (existingBooking) {
      console.log("Duplicate BookingID found:", newBID); // Debugging
      await transaction.rollback(); // Rollback the transaction
      return res.status(400).json({ error: `Duplicate BookingID found: ${newBID}` });
    }

    // Log the new BookingID before creating the booking
    console.log("BookingID to be used:", newBID); // Debugging

    // Create the booking within the transaction
    const bookingDetails = {
      BookingID: newBID,
      RoomID,
      FacultyName,
      FacultyID,
      CourseCode,
      Purpose,
      ResourceNeeds,
      Date,
      FromTime,
      ToTime,
      Status: "Pending",
    };

    const newBooking = await Bookings.create(bookingDetails, { transaction });

    // Commit the transaction
    await transaction.commit();

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);

    // Rollback the transaction in case of an error
    if (transaction) await transaction.rollback();

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: `Duplicate BookingID found: ${req.body.BookingID}` });
    }
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};


exports.getBookingsByFacultyID = async (req, res) => {
    const  FacultyID  = req.params.id;
    // const FacultyID  = 'CS124';
try {
    const bookings = await Bookings.findAll({
        where: { FacultyID },
    });
    res.status(200).json(bookings);
} catch (error) {
    console.error("Error fetching bookings by FacultyID:", error);
    res.status(500).json({ error: "Internal Server Error" });
}
};

exports.getBookingsByDate = async (req, res) => {
  const { facultyID } = req.params;
  const { date } = req.query;

  try {
    // Ensure the date is parsed correctly
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1); // Move the date to the next day for the query

    // Find bookings within the date range
    const bookings = await Bookings.findAll({
      where: {
        FacultyID: facultyID,
        Date: {
          [Op.gte]: startDate,  // Greater than or equal to the start date
          [Op.lt]: endDate,     // Less than the next day (exclusive)
        }
      }
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings by date:', error);
    res.status(500).json({ message: 'Failed to fetch bookings for the selected date' });
  }
};


exports.getBookings = async (req, res) => {
    try {
        const bookings = await Bookings.findAll(); // Fetch all booking records
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};






exports.getAvailableRooms = async (req, res) => {
  const { date, fromTime, toTime, block, floor, type, capacity, userTeam } = req.query;

  if (!date || !fromTime || !toTime) {
      return res.status(400).json({
          error: "Missing required query parameters: date, fromTime, and toTime are mandatory.",
      });
  }

  try {
      const formattedFromTime = `${fromTime}:00`;
      const formattedToTime = `${toTime}:00`;
      const dateOnly = date.split("T")[0];

      let bookedRoomIDs = [];

      if (userTeam !== "placement") {
          // Fetch booked rooms that have a time overlap (only if the user is NOT from the placement team)
          const bookedRooms = await Bookings.findAll({
              where: {
                  [Op.and]: [
                      Sequelize.where(Sequelize.fn("DATE", Sequelize.col("Date")), dateOnly),
                      { Status: { [Op.ne]: "Cancelled" } },
                      {
                          [Op.or]: [
                              { FromTime: { [Op.lt]: formattedToTime }, ToTime: { [Op.gt]: formattedFromTime } },
                              { FromTime: { [Op.lte]: formattedFromTime }, ToTime: { [Op.gte]: formattedToTime } },
                          ],
                      },
                  ],
              },
              attributes: ["RoomID"],
          });

          bookedRoomIDs = bookedRooms.map((booking) => booking.RoomID);
      }

      // Fetch all rooms (if placement team) or exclude booked ones (if not)
      const availableRooms = await Room.findAll({
          where: {
              ...(userTeam !== "placement" && bookedRoomIDs.length > 0 && { RoomID: { [Op.notIn]: bookedRoomIDs } }),
              ...(block && { Block: block }),
              ...(floor && { Floor: floor }),
              ...(type && { Type: type }),
              ...(capacity && { 
                  Capacity: { 
                      [Op.gte]: capacity / 2,  
                      [Op.lte]: capacity + 15
                  } 
              }),
          },
      });

      if (availableRooms.length === 0) {
          return res.json({ message: "No rooms available." });
      }

      res.json(availableRooms);
  } catch (error) {
      console.error("Error fetching available rooms:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};



// Fetch all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Bookings.findAll();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { Status, FacultyId } = req.body;

  try {
    const booking = await Bookings.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    booking.Status = Status;
    booking.UpdatedBy = FacultyId;
    await booking.save();

    res.status(200).json({ message: `Booking ${Status}`, booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error });
  }
};


exports.getAllBookingIDs = async (req, res) => {
  console.log("Fetching all booking IDs");
  try {
    const { date, fromTime, toTime } = req.query;
    console.log("Fetching all booking IDs for the selected date and time range");

    // Validate required fields (date, fromTime, toTime)
    if (!date || !fromTime || !toTime) {
      return res.status(400).json({ message: "Missing required query parameters: date, fromTime, or toTime" });
    }

    // Format times and date correctly
    const formattedFromTime = `${fromTime}:00`;  // Add the seconds to the time
    const formattedToTime = `${toTime}:00`;      // Add the seconds to the time
    const dateOnly = date.split("T")[0];          // Extract date part from the ISO string



    // Construct the where clause to match both date and time properly
    const whereClause = {
      Date: {
        [Op.between]: [`${dateOnly} 00:00:00`, `${dateOnly} 23:59:59`], // Compare the entire day
      },
      [Op.and]: [
        { FromTime: { [Op.lte]: formattedToTime } }, // Booking starts before or at the requested end time
        { ToTime: { [Op.gte]: formattedFromTime } }, // Booking ends after or at the requested start time
      ],
    };



    // Query the database
    const bookings = await Bookings.findAll({
      where: whereClause,
    });

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No rooms booked for the selected criteria" });
    }

    res.status(200).json(bookings.map(booking => booking.RoomID));
  } catch (error) {
    // Log the error and respond with status 500
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

exports.getAllBookingIDsForConflict = async (req, res) => {
  try {
    const { date, fromTime, toTime } = req.query;
    console.log("Fetching all booking IDs for the selected date and time rangesssss");

    // Validate required fields (date, fromTime, toTime)
    if (!date || !fromTime || !toTime) {
      return res.status(400).json({ message: "Missing required query parameters: date, fromTime, or toTime" });
    }

    // Format times and date correctly
    const formattedFromTime = `${fromTime}:00`;  // Add the seconds to the time
    const formattedToTime = `${toTime}:00`;      // Add the seconds to the time
    const dateOnly = date.split("T")[0];          // Extract date part from the ISO string


    // Construct the where clause to match both date and time properly
    const whereClause = {
      Date: {
        [Op.between]: [`${dateOnly} 00:00:00`, `${dateOnly} 23:59:59`], // Compare the entire day
      },
      [Op.and]: [
        { FromTime: { [Op.lte]: formattedToTime } }, // Booking starts before or at the requested end time
        { ToTime: { [Op.gte]: formattedFromTime } }, // Booking ends after or at the requested start time
      ],
    };



    // Query the database
    const bookings = await Bookings.findAll({
      attributes: ["RoomID", "BookingID"], 

      where: whereClause,
      limit: 50, // Adjust based on expected conflicts
    });
    console.log("bookings", bookings);

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No rooms booked for the selected criteria" });
    }

    res.status(200).json(
      bookings.map(booking => ({
        RoomID: booking.RoomID,
        BookingID: booking.BookingID
      }))
    );
    
  } catch (error) {
    // Log the error and respond with status 500
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};


exports.getBookingByBookedId = async (req, res) => {
  try {
    console.log("Fetching booking with ID:", req.params.id);
    const { id } = req.params;
    const booking = await Bookings.findByPk(id);

    if (!booking) {
      console.log("Booking not found for ID:", id);
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("Booking found:", booking);
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};