import Table from "../features/Table";

function AppLayout() {
  return (
    <div className="h-full p-8 bg-stone-50 flex flex-col justify-center gap-9">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl text-zinc-700 font-semibold">
          Remote frontend jobs
        </h1>
        <h2 className="text-large text-zinc-500 font-normal">
          Find your remote dev job.
        </h2>
      </div>
      <Table />
    </div>
  );
}

export default AppLayout;
