import React, { createContext, useState } from 'react';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const resetBooking = () => {
    setSelectedEvent(null);
    setSelectedTicket(null);
    setTicketQuantity(1);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedEvent,
        setSelectedEvent,
        selectedTicket,
        setSelectedTicket,
        ticketQuantity,
        setTicketQuantity,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
