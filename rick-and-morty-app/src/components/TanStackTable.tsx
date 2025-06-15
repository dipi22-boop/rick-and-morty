import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  useQuery,
} from '@tanstack/react-query';
import { useState } from 'react'

interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

interface Origin {
  name: string;
  url: string;
}

interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: Origin;
  image: string;
}

interface ApiResponse {
  info: Info;
  results: Character[];
}

// --- TanStack Table Column Helper ---
const columnHelper = createColumnHelper<Character>();

// --- Column Definitions ---
const columns = [
  columnHelper.accessor('image', {
    header: () => <span>Image</span>,
    cell: (info) => (
      <img
        src={info.getValue()}
        alt="character"
        className="rounded-full w-12 h-12 object-cover"
        width="48"
        height="48"
        loading="lazy"
      />
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('name', {
    header: () => 'Name',
    cell: (info) => <span className="font-bold">{info.getValue()}</span>,
  }),
  columnHelper.accessor('status', {
    header: () => 'Status',
    cell: (info) => {
      const status = info.getValue();
      const statusColor =
        status === 'Alive' ? 'bg-green-500' :
        status === 'Dead' ? 'bg-red-500' :
        'bg-gray-500';
      return (
        <span className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${statusColor}`}></span>
          {status}
        </span>
      );
    },
  }),
  columnHelper.accessor('species', {
    header: () => <span>Species</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('gender', {
    header: () => <span>Gender</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('origin', {
    header: 'Origin',
    cell: (info) => <span>{info.getValue().name}</span>,
  }),
];



// --- Data Fetching Function for TanStack Query ---
const fetchCharacters = async (page: number): Promise<ApiResponse> => {
  const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${page}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};


const TanStackTable = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // --- Use TanStack Query to fetch data ---
  const { isLoading, isError, data, error } = useQuery<ApiResponse, Error>({
    queryKey: ['characters', currentPage],
    queryFn: () => fetchCharacters(currentPage),
    keepPreviousData: true, // For a smoother pagination experience
  });

  const characters = data?.results ?? [];
  const pageInfo = data?.info;

  // --- TanStack Table Instance ---
  const table = useReactTable({
    data: characters,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: pageInfo?.pages ?? -1,
  });

  // --- Handlers for Pagination ---
  const goToNextPage = () => {
    if (pageInfo?.next) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (pageInfo?.prev) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-cyan-400"></div>
          </div>
        )}

        {isError && <div className="text-center text-red-500 bg-red-900/20 p-4 rounded-md">Error: {error.message}</div>}

        {!isLoading && !isError && (
          <div className="bg-gray-800 rounded-lg shadow-2xl shadow-cyan-500/[.1] overflow-x-auto">
            {/* --- Table --- */}
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-700">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="p-4 text-left font-semibold text-gray-300">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="p-4 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- Pagination Controls --- */}
        {data && (
          <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
            <span className="text-gray-400">
              Page{' '}
              <strong>
                {currentPage} of {pageInfo?.pages}
              </strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={!pageInfo?.prev}
                className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500 transition-colors duration-200"
              >
                Previous
              </button>
              <button
                onClick={goToNextPage}
                disabled={!pageInfo?.next}
                className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TanStackTable;