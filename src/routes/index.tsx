import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../ui/AppLayout";

export const Route = createFileRoute("/")({
  validateSearch: (search) => {
    const pageParam = search.page;
    const parsed = Number(pageParam);

    return {
      page: Number.isNaN(parsed) || parsed < 1 ? 1 : parsed,
    };
  },
  component: AppLayout,
});
