"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { Trash2 } from "lucide-react";
import { deleteUserAction, getAllUsers } from "@/actions/UserActions";
import EditUser from "./edit-user";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UserPage = () => {
  const [rows, setRows] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      editable: false,
    },
    {
      field: "email",
      headerName: "email",
      width: 250,
      editable: false,
    },
    {
      field: "role",
      headerName: "Role",
      width: 200,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center">
            <span
              className={`${
                params.row.role === "Admin"
                  ? "text-green-700"
                  : "text-brandColor"
              }`}
            >
              {params.row.role}
            </span>
          </div>
        );
      },
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
            
            <EditUser preselectedUser={params.row} refetchData={fetchData}/>
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
      const data = await getAllUsers(setLoading);
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

  const handleDelete = async (id: number) => {
    try {
      // Show confirmation dialog
      if (!confirm("Are you sure you want to delete this User?")) {
        return;
      }
      const response = await deleteUserAction(id);
      if (response.success) {
        toast.success(response.message);
        fetchData(); // Refetch data after successful deletion
      } else {
        toast.error(response.message);
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
            <span className="text-brandColor">Users</span> data for OnBoard
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

export default UserPage;
