import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../ui/AppLayout";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => {
    const pageSizeParam = search.pageSize;
    const pageSizeParsed = Number(pageSizeParam);

    return {
      pageSize:
        Number.isNaN(pageSizeParsed) ||
        pageSizeParsed < 1 ||
        ![10, 20, 50].includes(pageSizeParsed)
          ? 10
          : pageSizeParsed,
    };
  },
  component: AppLayout,
});
