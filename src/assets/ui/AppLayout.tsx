import Table from "../components/Table";

function AppLayout() {
  return (
    <div className="h-full p-8 bg-red-50 flex justify-center items-center">
      <h1 className="text-3xl text-zinc-600 font-bold">Job Table</h1>
      <Table />
    </div>
  );
}

export default AppLayout;
