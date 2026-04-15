import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  // Expected: /api-v1/v1/tasks or /api-v1/v1/tasks/:id
  const version = pathParts.find((p) => p.startsWith("v"));
  
  if (version !== "v1") {
    return new Response(
      JSON.stringify({ error: "Invalid API version. Use v1.", status: 400 }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Validate auth
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing authorization header", status: 401 }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: "Invalid or expired token", status: 401 }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const resource = pathParts[pathParts.indexOf("v1") + 1];
  
  if (resource !== "tasks") {
    return new Response(
      JSON.stringify({ error: `Unknown resource: ${resource}`, status: 404 }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const taskId = pathParts[pathParts.indexOf("v1") + 2];

  try {
    switch (req.method) {
      case "GET": {
        if (taskId) {
          const { data, error } = await supabase.from("tasks").select("*").eq("id", taskId).single();
          if (error) return jsonRes({ error: error.message }, 404);
          return jsonRes(data, 200);
        }
        const status = url.searchParams.get("status");
        const priority = url.searchParams.get("priority");
        let query = supabase.from("tasks").select("*").order("created_at", { ascending: false });
        if (status) query = query.eq("status", status);
        if (priority) query = query.eq("priority", priority);
        const { data, error } = await query;
        if (error) return jsonRes({ error: error.message }, 500);
        return jsonRes({ data, count: data?.length ?? 0 }, 200);
      }
      case "POST": {
        const body = await req.json();
        if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
          return jsonRes({ error: "Title is required and must be a non-empty string" }, 400);
        }
        const { data, error } = await supabase.from("tasks").insert({
          user_id: user.id,
          title: body.title.trim().slice(0, 200),
          description: body.description?.trim().slice(0, 1000) || null,
          status: ["todo", "in_progress", "done"].includes(body.status) ? body.status : "todo",
          priority: ["low", "medium", "high"].includes(body.priority) ? body.priority : "medium",
          due_date: body.due_date || null,
        }).select().single();
        if (error) return jsonRes({ error: error.message }, 500);
        return jsonRes(data, 201);
      }
      case "PUT":
      case "PATCH": {
        if (!taskId) return jsonRes({ error: "Task ID required" }, 400);
        const body = await req.json();
        const updates: Record<string, unknown> = {};
        if (body.title !== undefined) updates.title = String(body.title).trim().slice(0, 200);
        if (body.description !== undefined) updates.description = body.description?.trim().slice(0, 1000) || null;
        if (body.status && ["todo", "in_progress", "done"].includes(body.status)) updates.status = body.status;
        if (body.priority && ["low", "medium", "high"].includes(body.priority)) updates.priority = body.priority;
        if (body.due_date !== undefined) updates.due_date = body.due_date || null;
        const { data, error } = await supabase.from("tasks").update(updates).eq("id", taskId).select().single();
        if (error) return jsonRes({ error: error.message }, 404);
        return jsonRes(data, 200);
      }
      case "DELETE": {
        if (!taskId) return jsonRes({ error: "Task ID required" }, 400);
        const { error } = await supabase.from("tasks").delete().eq("id", taskId);
        if (error) return jsonRes({ error: error.message }, 404);
        return jsonRes({ message: "Task deleted successfully" }, 200);
      }
      default:
        return jsonRes({ error: "Method not allowed" }, 405);
    }
  } catch (e) {
    return jsonRes({ error: "Internal server error" }, 500);
  }

  function jsonRes(body: unknown, status: number) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
