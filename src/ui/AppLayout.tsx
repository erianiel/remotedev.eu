import Header from "../features/Header";
import FilterBar from "../features/FilterBar";
import Table from "../features/Table";

function AppLayout() {
  return (
    <div className="h-full p-8 flex flex-col justify-center gap-8 md:gap-9">
      <Header />
      <div className="flex flex-col gap-4">
        <FilterBar />
        <Table />
      </div>
    </div>
  );
}

export default AppLayout;
