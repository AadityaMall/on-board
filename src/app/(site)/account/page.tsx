"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/middleware/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Edit,
  Clock,
  CalendarCheck,
  Map,
  CreditCard,
  User,
  Plane,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { updateUserAction } from "@/actions/UserActions";
import { getBookingByUserId } from "@/actions/BookingActions";
import { getScheduleById } from "@/actions/ScheduleActions";

interface Schedule {
  id: string;
  dateTime: string;
  flightResponse: {
    flightId: string;
    flightNumber: number;
    company: string;
    totalSeats: number;
    bookedSeats: number;
    seatType: Array<{
      type: string;
      count: number;
      price: number;
    }>;
  };
  sourceAirportResponse: {
    name: string;
    city: string;
    id: number;
    country: string;
  };
  destinationAirportResponse: {
    name: string;
    city: string;
    id: number;
    country: string;
  };
}

interface Booking {
  id: string;
  scheduleId: string;
  userId: number;
  seatNumbers: number[];
  amount: number;
  status: string;
  dateTime: string;
  razorpayPaymentId: string;
  schedule?: Schedule;
}

const AccountPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setEditFormData({
        name: user.name,
        email: user.email,
      });
      fetchUserBookings();
    }
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      if (!user?.id) return;
      const response = await getBookingByUserId(user.id);

      // Get bookings and enrich them with schedule data
      const bookingsData = response.data || [];
      const enrichedBookings = await Promise.all(
        bookingsData.map(async (booking: Booking) => {
          try {
            const scheduleResponse = await getScheduleById(booking.scheduleId);
            return {
              ...booking,
              schedule: scheduleResponse.data,
              // Set a default status if null
              status: booking.status || "Confirmed",
            };
          } catch (error) {
            console.error("Failed to fetch schedule for booking:", error);
            return booking;
          }
        })
      );

      setBookings(enrichedBookings);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      if (!user?.id) return;

      const userData = {
        id: user.id,
        name: editFormData.name,
        email: editFormData.email,
      };

      await updateUserAction(userData);
      toast.success("Profile updated successfully");
      setIsDialogOpen(false); // Close dialog on success
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    if (!status) return "bg-blue-100 text-blue-800"; // Default status styling

    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* User Profile Section */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-brandColor">
                  My Profile
                </h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1 hover:text-brandColor"
                    >
                      <Edit size={16} /> Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-brandColor font-semibold text-2xl">
                        Edit Profile
                      </DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleProfileUpdate}>
                      <InputField
                        label="Full Name"
                        type="text"
                        id="name"
                        name="name"
                        value={editFormData.name}
                        onChange={handleInputChange}
                        icon={<User size={20} className="form-icon" />}
                      />
                      <InputField
                        label="Email Address"
                        type="email"
                        id="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleInputChange}
                        icon={<User size={20} className="form-icon" />}
                      />
                      <DialogFooter>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={updateLoading}
                        >
                          {updateLoading ? "Updating..." : "Save Changes"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mb-4">
                <div className="h-24 w-24 bg-gradient-to-r from-brandColor to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md mx-auto mb-4">
                  {user?.name?.[0].toUpperCase()}
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-b pb-3">
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div className="border-b pb-3">
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium">{user?.role || "User"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking History Section */}
          <div className="md:w-2/3">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
              <h2 className="text-2xl font-semibold text-brandColor mb-6">
                My Bookings
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✈️</div>
                  <h3 className="text-xl font-medium mb-2">
                    No bookings found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    You haven't made any bookings yet.
                  </p>
                  <Button onClick={() => (window.location.href = "/schedules")}>
                    Explore Flights
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((booking) => {
                    // Check if schedule data is available
                    const hasScheduleData = booking.schedule !== undefined;

                    return (
                      <div
                        key={booking.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            {hasScheduleData ? (
                              <h3 className="font-semibold">
                                {booking?.schedule?.flightResponse.company} #
                                {booking?.schedule?.flightResponse.flightNumber}
                              </h3>
                            ) : (
                              <h3 className="font-semibold">
                                Booking #{booking.id.slice(-6)}
                              </h3>
                            )}
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Clock size={14} className="mr-1" />
                              {format(booking.dateTime, "dd MMM yyyy, h:mm a")}
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                              booking.status
                            )}`}
                          >
                            {booking.status || "Confirmed"}
                          </span>
                        </div>

                        {hasScheduleData && (
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-start">
                              <Map
                                size={16}
                                className="mr-2 mt-0.5 text-gray-500"
                              />
                              <div>
                                <p className="text-xs text-gray-500">From</p>
                                <p className="font-medium">
                                  {
                                    booking?.schedule?.sourceAirportResponse
                                      .city
                                  }
                                </p>
                                <p className="text-xs text-gray-500">
                                  {
                                    booking?.schedule?.sourceAirportResponse
                                      .name
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Map
                                size={16}
                                className="mr-2 mt-0.5 text-gray-500"
                              />
                              <div>
                                <p className="text-xs text-gray-500">To</p>
                                <p className="font-medium">
                                  {
                                    booking?.schedule
                                      ?.destinationAirportResponse.city
                                  }
                                </p>
                                <p className="text-xs text-gray-500">
                                  {
                                    booking?.schedule
                                      ?.destinationAirportResponse.name
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <div className="flex items-center">
                            <CalendarCheck
                              size={16}
                              className="mr-2 text-gray-500"
                            />
                            <span className="text-sm">
                              Seats:{" "}
                              {booking.seatNumbers
                                .sort((a, b) => a - b)
                                .join(", ")}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <CreditCard
                              size={16}
                              className="mr-2 text-gray-500"
                            />
                            <span className="font-semibold text-brandColor">
                              ₹{booking.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {booking.razorpayPaymentId && (
                          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                            Payment ID: {booking.razorpayPaymentId}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AccountPage;
