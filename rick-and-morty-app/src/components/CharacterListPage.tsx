import { useState, useEffect } from 'react';
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';

// --- Type Definitions based on the Rick and Morty API ---
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

interface Location {
  name: string;
  url: string;
}

interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: Origin;
  location: Location;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

interface ApiListResponse {
  info: Info;
  results: Character[];
}

// --- TanStack Table Column Helper ---
const columnHelper = createColumnHelper<Character>();



// --- Data Fetching Functions ---
const fetchCharacters = async (page: number): Promise<ApiListResponse> => {
  const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${page}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// --- Helper to get page from URL ---
const getPageFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  const page = parseInt(params.get('page') || '1', 10);
  return isNaN(page) ? 1 : page;
};

// --- Character List Page Component ---
export default function CharacterListPage({ onCharacterSelect }) {
  const [currentPage, setCurrentPage] = useState(getPageFromURL());
  const queryClient = useQueryClient();
  
  // --- Column Definitions for the list view ---
const columns = [
  columnHelper.display({
    id: 'serialNumber',
    header: 'Number',
    cell: (info) => <span className='text-center'>{(currentPage - 1) * 20 + info.row.index + 1}</span>,
  }),
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
  columnHelper.accessor('origin', {
    header: 'Origin',
    cell: (info) => <span>{info.getValue().name}</span>,
  }),
];
  // --- Effect to sync URL with state ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', currentPage.toString());
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    // Use replaceState to avoid cluttering browser history for simple pagination
    window.history.replaceState({ path: newUrl }, '', newUrl);
  }, [currentPage]);

  // --- Effect to handle browser back/forward buttons ---
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromURL());
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const { isLoading, isError, data, error, refetch, isFetching } = useQuery<ApiListResponse, Error>({
    queryKey: ['characters', currentPage],
    queryFn: () => fetchCharacters(currentPage),
    keepPreviousData: true,
  });

  const characters = data?.results ?? [];
  const pageInfo = data?.info;

  const table = useReactTable({
    data: characters,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: pageInfo?.pages ?? -1,
  });

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

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['characters', currentPage] });
  };
  return (
    <div className="p-4">
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-cyan-400"></div>
        </div>
      )}

      {isError && <div className="text-center text-red-500 bg-red-900/20 p-4 rounded-md">Error: {error.message}</div>}

      {!isLoading && !isError && (
        <div className="bg-gray-700 rounded-lg overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-700">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="p-4 text-left font-semibold text-gray-300">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} onClick={() => onCharacterSelect(row.original.id)} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer">
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

      {data && (
        <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
          <span className="text-gray-400">Page <strong>{currentPage} of {pageInfo?.pages}</strong></span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isFetching}
              className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`h-5 w-5 ${isFetching ? 'animate-spin' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0 0h-4.992" />
              </svg>
              <span>
                {isFetching ? 'Refreshing...' : 'Refresh'}
              </span>
            </button>
            <button onClick={goToPreviousPage} disabled={!pageInfo?.prev || isFetching} className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500 transition-colors duration-200">
              Previous
            </button>
            <button onClick={goToNextPage} disabled={!pageInfo?.next || isFetching} className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500 transition-colors duration-200">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}