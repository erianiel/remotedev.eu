import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Configuration constants
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://remotedev.eu",
  "https://erianiel.github.io",
  "https://erianiel.github.io/remotedev.eu",
] as const;
const DEFAULT_LIMIT = 30;
const FILTER_WHITELIST = new Set(["company", "country"]);

// Type definitions
interface AggregationResponse {
  data: [];
  meta: {
    total: number;
    limit: number;
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
    const filter = url.searchParams.get("filter");
    const q = url.searchParams.get("q");
    const limit = Number(url.searchParams.get("limit") || DEFAULT_LIMIT);

    // Validate limit
    if (Number.isNaN(limit) || limit < 1 || limit > 100) {
      return createJsonResponse({ error: "Invalid page size" }, 400, origin);
    }

    // Validate filter parameters
    const isFilterValid = filter && FILTER_WHITELIST.has(filter);
    if (!isFilterValid) {
      return createJsonResponse(
        { error: "Invalid filter parameter" },
        400,
        origin
      );
    }

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 15);

    // Fetch data from Supabase (via view jobs_distinct_{filter})
    const table = `jobs_distinct_${filter}`;

    let query = supabase
      .from(table)
      .select(filter, { count: "exact" })
      .gte("created_at", twoWeeksAgo.toISOString())
      .order(filter, { ascending: true })
      .limit(limit);

    // Optional case-insensitive substring search
    if (q && q.trim() !== "") {
      query = query.ilike(filter, `%${q.trim()}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return createJsonResponse({ error }, 500, origin);
    }

    const response: AggregationResponse = {
      data: data ?? [],
      meta: {
        total: count ?? 0,
        limit,
      },
    };

    return createJsonResponse(response, 200, origin);
  } catch (error) {
    return createJsonResponse({ error }, 500, origin);
  }
});
