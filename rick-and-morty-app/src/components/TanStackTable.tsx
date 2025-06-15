import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { USERS } from "../data";

import * as React from 'react'

type User = {
  firstName: string
  lastName: string
}

const userColumnHelper = createColumnHelper<User>()

const columns = [
  userColumnHelper.accessor('firstName', {
    header: () => 'firstName',
    cell: info => info.getValue(),
  }),
  userColumnHelper.accessor('lastName', {
    header: () => 'lastName',
    cell: info => info.renderValue(),
  })
]

const TanStackTable = () => {
  const [data, setData] = React.useState(USERS)
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (

    <div className="p-2">
      <table className="border border-gray-700 w-full text-left">
        <thead className="bg-indigo-600">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="capitalize px-3.5 py-2">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row, i) => (
              <tr key={row.id} className={`
                ${i % 2 === 0 ? "bg-gray-200" : "bg-gray-200"}
                `}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-3.5 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))) : (
            <tr className="text-center h-32">
              <td colSpan={12}>No Recoard Found!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>


  )

};

export default TanStackTable;