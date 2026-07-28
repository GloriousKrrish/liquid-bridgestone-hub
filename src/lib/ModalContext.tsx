import React, { createContext, useContext, useState } from "react";

type BookingDetails = {
  dealerName: string;
  tyreName?: string;
  price?: string;
};

type ModalContextType = {
  bookingDetails: BookingDetails | null;
  isBookingOpen: boolean;
  openBooking: (details: BookingDetails) => void;
  closeBooking: () => void;

  isPartnerLoginOpen: boolean;
  openPartnerLogin: () => void;
  closePartnerLogin: () => void;

  isFleetDeskOpen: boolean;
  openFleetDesk: () => void;
  closeFleetDesk: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPartnerLoginOpen, setIsPartnerLoginOpen] = useState(false);
  const [isFleetDeskOpen, setIsFleetDeskOpen] = useState(false);

  const openBooking = (details: BookingDetails) => {
    setBookingDetails(details);
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setBookingDetails(null);
    setIsBookingOpen(false);
  };

  const openPartnerLogin = () => setIsPartnerLoginOpen(true);
  const closePartnerLogin = () => setIsPartnerLoginOpen(false);

  const openFleetDesk = () => setIsFleetDeskOpen(true);
  const closeFleetDesk = () => setIsFleetDeskOpen(false);

  return (
    <ModalContext.Provider
      value={{
        bookingDetails,
        isBookingOpen,
        openBooking,
        closeBooking,
        isPartnerLoginOpen,
        openPartnerLogin,
        closePartnerLogin,
        isFleetDeskOpen,
        openFleetDesk,
        closeFleetDesk,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModals = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModals must be used within a ModalProvider");
  }
  return context;
};
