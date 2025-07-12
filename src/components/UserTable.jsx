import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function UserTable({ data, setData, onAddUserClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [sorting, setSorting] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useMemo(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((user) => {
      const matchesName = user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole ? user.role === selectedRole : true;
      return matchesName && matchesRole;
    });
  }, [data, searchTerm, selectedRole]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: "name",
        header: "Name",
        enableEditing: true,
        size: 200,
      },
      {
        accessorKey: "email",
        header: "Email",
        enableEditing: true,
        size: 250,
      },
      {
        accessorKey: "role",
        header: "Role",
        enableEditing: true,
        size: 150,
      },
      {
        accessorKey: "status",
        header: "Status",
        enableEditing: true,
        size: 150,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const isEditing = editingRowId === row.original.id;

          const onEditClick = () => {
            setEditingRowId(row.original.id);
            setEditFormData({ ...row.original });
          };

          const onCancelClick = () => {
            setEditingRowId(null);
            setEditFormData({});
          };

          const onSaveClick = () => {
            setData((old) =>
              old.map((item) =>
                item.id === editingRowId ? { ...item, ...editFormData } : item
              )
            );
            setEditingRowId(null);
            setEditFormData({});
          };

          const onDeleteClick = () => {
            if (window.confirm("Are you sure you want to delete this user?")) {
              setData((old) =>
                old.filter((item) => item.id !== row.original.id)
              );
              if (editingRowId === row.original.id) {
                setEditingRowId(null);
                setEditFormData({});
              }
            }
          };

          return (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={onSaveClick}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={onCancelClick}
                    className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onEditClick}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={onDeleteClick}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          );
        },
        enableSorting: false,
        enableEditing: false,
        size: 150,
      },
    ],
    [editingRowId, editFormData, setData]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    pageCount: Math.ceil(filteredData.length / 5),
    initialState: { pagination: { pageSize: 5 } },
  });

  const handleInputChange = (field, value) => {
    setEditFormData((old) => ({
      ...old,
      [field]: value,
    }));
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Recruiter">Recruiter</option>
            <option value="Hiring Manager">Hiring Manager</option>
            <option value="User">User</option>
          </select>
        </div>
        <button
          onClick={onAddUserClick}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-sm transition"
        >
          Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse bg-white dark:bg-gray-900 rounded-md">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50 dark:bg-gray-800">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition sticky top-0 bg-gray-50 dark:bg-gray-800 z-10`}
                    style={{ width: header.column.columnDef.size }}
                    scope="col"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() ? (
                      <span className="ml-1">
                        {header.column.getIsSorted() === "asc" ? "↑" : "↓"}
                      </span>
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm"
                >
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                const isEditing = editingRowId === row.original.id;
                return (
                  <tr
                    key={row.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const editable = cell.column.columnDef.enableEditing;
                      const cellValue = isEditing
                        ? editFormData[cell.column.id]
                        : cell.getValue();

                      return (
                        <td
                          key={cell.id}
                          className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
                          style={{ width: cell.column.columnDef.size }}
                        >
                          {isEditing && editable ? (
                            cell.column.id === "role" ||
                            cell.column.id === "status" ? (
                              <select
                                value={cellValue || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    cell.column.id,
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              >
                                {cell.column.id === "role" ? (
                                  <>
                                    <option value="Recruiter">Recruiter</option>
                                    <option value="Hiring Manager">
                                      Hiring Manager
                                    </option>
                                    <option value="Admin">Admin</option>
                                    <option value="User">User</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Inactive">Inactive</option>
                                  </>
                                )}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={cellValue || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    cell.column.id,
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              />
                            )
                          ) : (
                            flexRender(
                              cell.column.columnDef.cell ??
                                ((info) => info.getValue()),
                              cell.getContext()
                            )
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm text-gray-700 dark:text-gray-300 gap-4">
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
