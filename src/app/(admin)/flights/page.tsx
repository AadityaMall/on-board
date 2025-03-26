"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchFlightAction, deleteFlightAction } from "@/actions/FlightActions";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Trash2 } from "lucide-react";
import FlightForm from "./add-flight";
import CustomDrawer from "@/components/Admin/Layout/CustomDrawer";
import FlightDialogue from "./edit-flight"; // Create this component

interface Flight {
  id: string;
  number: number;
  company: string;
  totalSeats: number;
  seatType: Array<{ type: string; count: number }>;
}

const FlightPage = () => {
  const [rows, setRows] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      renderCell: (params: any) => (
        <span className="truncate block" title={params.value}>
          {params.value.slice(0, 8)}... {/* Show only first 8 characters */}
        </span>
      ),
    },
    {
      field: "number",
      headerName: "Number",
      width:90,
      editable: false,
    },
    {
      field: "company",
      headerName: "Company",
      flex:1,
      editable: false,
    },
    {
      field: "totalSeats",
      headerName: "Total Seats",
      width: 110,
    },
    {
      field: "seatTypes",
      headerName: "Seat Types",
      width: 110,
      renderCell: (params: any) => (
        <span>{params.row.seatTypes?.length}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      minWidth: 110,
      flex: 0.5,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <div className="!flex !items-center gap-4">
            <FlightDialogue preselectedFlight={params.row} refetchData={fetchData}/>
            <Button
              variant="destructive"
              onClick={() => handleDelete(params.row.id)}
            >
              <Trash2 />
            </Button>
          </div>
        );
      },
    },
  ];

  const fetchData = async () => {
    try {
      const data = await fetchFlightAction(setLoading);
      console.log(data.data);

      const formattedRows = data.data.map((flight: any) => ({
        id: flight.flightId, // Ensure ID is unique
        number: flight.flightNumber,
        company: flight.company,
        totalSeats: flight.totalSeats,
        seatTypes: flight.seatType, // Store length of seatType array
      }));

      setRows(formattedRows);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      // Show confirmation dialog
      if (!confirm("Are you sure you want to delete this flight?")) {
        return;
      }
      const response = await deleteFlightAction(id);
      if (response.success) {
        toast.success(response.message);
        fetchData(); // Refetch data after successful deletion
      } else {
        toast.error(response.message);
      }
      if (response.warning) {
        toast.warning(response.warning);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col w-full mt-8">
        <div className="flex justify-between md:mx-12 items-baseline">
          <h2 className="mt-5 font-bold text-xl">
            <span className="text-brandColor">Flights</span> data for OnBoard
          </h2>
          <CustomDrawer
            triggerText="Add"
            content={
              <FlightForm
                closeDrawer={() => setIsDrawerOpen(false)}
                refetchData={fetchData}
              />
            }
            open={isDrawerOpen}
            setIsOpen={setIsDrawerOpen}
          />
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

      {/* <EditDialog
        open={isEditOpen}
        onClose={() => {
          setSelectedAirport(null);
          setIsEditOpen(false);
        }}
        // airport={
        //   selectedAirport ? selectedAirport : { id: 0, name: "", city: "" }
        // }
        refetchData={fetchData}
      /> */}
    </>
  );
};

export default FlightPage;
