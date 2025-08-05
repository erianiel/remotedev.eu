import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../ui/AppLayout";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => {
    const pageParam = search.page;
    const pageSizeParam = search.pageSize;
    const pageParsed = Number(pageParam);
    const pageSizeParsed = Number(pageSizeParam);

    return {
      page: Number.isNaN(pageParsed) || pageParsed < 1 ? 1 : pageParsed,
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
