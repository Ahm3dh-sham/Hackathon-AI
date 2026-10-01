import { NextResponse } from "next/server";

// Next.js App Router route configuration for long-running AI agent workflows
export const maxDuration = 300; // 5 minutes max duration
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { problem_statement } = body;

    if (!problem_statement || !problem_statement.trim()) {
      return NextResponse.json({ error: "Problem statement is required." }, { status: 400 });
    }

    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";

    try {
      console.log(`[Next.js API Route] Invoking FastAPI multi-agent endpoint at ${backendUrl}/api/generate...`);
      const backendRes = await fetch(`${backendUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem_statement }),
        cache: "no-store",
      });

      if (backendRes.ok) {
        const data = await backendRes.json();
        console.log(`[Next.js API Route] Multi-agent execution completed successfully.`);
        return NextResponse.json(data);
      } else {
        const errText = await backendRes.text();
        console.error(`[Next.js API Route] Backend returned status ${backendRes.status}: ${errText}`);
        return NextResponse.json(
          { error: `Backend server error (${backendRes.status}): ${errText}` },
          { status: backendRes.status }
        );
      }
    } catch (backendErr: any) {
      console.error(`[Next.js API Route] Backend connection exception: ${backendErr.message}`);
      return NextResponse.json(
        { error: `Could not connect to FastAPI backend at ${backendUrl}. Please verify FastAPI is running on port 8000.` },
        { status: 503 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate blueprint." }, { status: 500 });
  }
}
