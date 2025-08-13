import Header from "../features/Header";
import Table from "../features/Table";

function AppLayout() {
  return (
    <div className="h-full p-8 flex flex-col justify-center gap-8 md:gap-9">
      <Header />
      <Table />
    </div>
  );
}

export default AppLayout;
