"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { Trash2 } from "lucide-react";
import { getAllBookings } from "@/actions/BookingActions";
import { format } from "date-fns";

const BookingsPage = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "userId",
      headerName: "User ID",
      flex: 1,
      editable: false,
    },
    {
      field: "dateTime",
      headerName: "Booking Date",
      flex: 1,

      renderCell: (params: any) => {
        return (
          <span>
            {format(new Date(params.row.dateTime), "dd MMMM, yyyy h:mm a")}
          </span>
        );
      },
    },
    {
      field: "totalSeatsBooked",
      headerName: "Total Seats Booked",
      flex: 1,

      renderCell: (params: any) => {
        return <span>{params.row.seatNumbers?.length}</span>;
      },
    },
    {
      field: "razorpayPaymentId",
      headerName: "Payment ID",
      flex: 1,
    },
    {
      field: "scheduleId",
      headerName: "Schedule ID",
      width: 150,
      editable: false,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 110,
    },
    // {
    //   field: "actions",
    //   headerName: "Action",
    //   minWidth: 110,
    //   flex: 0.5,
    //   sortable: false,
    //   renderCell: (params: any) => {
    //     return (
    //       <div className="!flex !items-center gap-4">
    //         <Button
    //           variant="destructive"
    //           onClick={() => handleDelete(params.row.id)}
    //         >
    //           <Trash2 />
    //         </Button>
    //       </div>
    //     );
    //   },
    // },
  ];

  const fetchData = async () => {
    try {
      const data = await getAllBookings(setLoading);
      setRows(data.data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

//   const handleDelete = async (id: number) => {
//     try {
//       // Show confirmation dialog
//       if (!confirm("Are you sure you want to delete this airport?")) {
//         return;
//       }
//       const response = await deleteBookingAction(id);
//       if (response.success) {
//         toast.success(response.message);
//         fetchData(); // Refetch data after successful deletion
//       } else {
//         toast.error(response.message);
//       }
//     } catch (error: any) {
//       toast.error(error.message);
//     }
//   };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col w-full mt-8">
        <div className="flex justify-between md:mx-12 items-baseline">
          <h2 className="mt-5 font-bold text-xl">
            <span className="text-brandColor">Airport</span> data for OnBoard
          </h2>
        </div>
        <div className="w-[90%] mx-auto mt-5">
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default BookingsPage;
