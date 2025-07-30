import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "../assets/ui/AppLayout";

export const Route = createFileRoute("/")({
  component: AppLayout,
});
