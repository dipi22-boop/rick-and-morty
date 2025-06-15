import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

// --- Create a client for TanStack Query ---
const queryClient = new QueryClient();
function App() {
  return (
    <MainLayout>
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider >
    </MainLayout>
  );
}

export default App;
