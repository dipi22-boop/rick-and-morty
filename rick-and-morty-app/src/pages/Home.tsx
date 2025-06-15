import TanStackTable from "../components/TanStackTable";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">Table Data</h2>
      <TanStackTable/>
    </div>
  );
};

export default Home;
