import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Configuration constants
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://remotedev.eu",
  "https://erianiel.github.io",
  "https://erianiel.github.io/remotedev.eu",
] as const;
const DEFAULT_PAGE_SIZE = 10;
const ALLOWED_PAGE_SIZES = [10, 20, 50];
const SORT_WHITELIST = new Set(["created_at", "title", "company", "location"]);

// Type definitions
type SortDirection = "asc" | "desc";
type Job = {
  title: string;
  url: string;
  company?: string;
  country?: string;
  location?: string;
  created_at: string;
};

interface JobResponse {
  data: Job[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    sort: string;
  };
}

// Helper functions
function createJsonResponse(body: unknown, status = 200, origin = "*") {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      Vary: "Origin",
    },
  });
}

function handleCorsOptions(origin: string) {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

function validateSort(sortParam: string): [string, SortDirection] | null {
  const [sortBy, sortDir] = sortParam.split(".") as [string, SortDirection];
  if (!SORT_WHITELIST.has(sortBy) || !["asc", "desc"].includes(sortDir)) {
    return null;
  }
  return [sortBy, sortDir];
}

// Main request handler
Deno.serve(async (req) => {
  const origin = req.headers.get("origin") ?? "";

  // CORS validation
  if (ALLOWED_ORIGINS.length && !ALLOWED_ORIGINS.includes(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return handleCorsOptions(origin);
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (!supabase) {
      return createJsonResponse(
        { error: "Internal Server Error" },
        500,
        origin
      );
    }

    // Parse and validate request parameters
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || "1");
    const pageSize = Number(
      url.searchParams.get("pageSize") || DEFAULT_PAGE_SIZE
    );

    // Validate page size
    if (Number.isNaN(pageSize) || !ALLOWED_PAGE_SIZES.includes(pageSize)) {
      return createJsonResponse({ error: "Invalid page size" }, 400, origin);
    }

    // Validate sort parameters
    const sortParam = url.searchParams.get("sort") ?? "created_at.desc";
    const sortValidation = validateSort(sortParam);
    if (!sortValidation) {
      return createJsonResponse(
        { error: "Invalid sort parameter" },
        400,
        origin
      );
    }
    const [sortBy, sortDir] = sortValidation;

    // Calculate pagination range
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 15);

    // Fetch data from Supabase
    const { data, error, count } = await supabase
      .from("jobs")
      .select("title,url,company,country,location,created_at", {
        count: "exact",
      })
      .gte("created_at", twoWeeksAgo.toISOString())
      .order(sortBy, { ascending: sortDir === "asc" })
      .range(from, to);

    if (error) {
      return createJsonResponse({ error }, 500, origin);
    }

    const response: JobResponse = {
      data: (data ?? []) as Job[],
      meta: {
        total: count ?? 0,
        page,
        pageSize,
        sort: `${sortBy}.${sortDir}`,
      },
    };

    return createJsonResponse(response, 200, origin);
  } catch (error) {
    return createJsonResponse({ error }, 500, origin);
  }
});
