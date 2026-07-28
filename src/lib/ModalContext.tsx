import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

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

  const openBooking = useCallback((details: BookingDetails) => {
    setBookingDetails(details);
    setIsBookingOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setBookingDetails(null);
    setIsBookingOpen(false);
  }, []);

  const openPartnerLogin = useCallback(() => setIsPartnerLoginOpen(true), []);
  const closePartnerLogin = useCallback(() => setIsPartnerLoginOpen(false), []);

  const openFleetDesk = useCallback(() => setIsFleetDeskOpen(true), []);
  const closeFleetDesk = useCallback(() => setIsFleetDeskOpen(false), []);

  const value = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModals = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModals must be used within a ModalProvider");
  }
  return context;
};
