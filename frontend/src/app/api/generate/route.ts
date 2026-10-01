import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { problem_statement } = body;

    if (!problem_statement || !problem_statement.trim()) {
      return NextResponse.json({ error: "Problem statement is required." }, { status: 400 });
    }

    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";

    // 120-second timeout signal to support full multi-agent LLM reasoning
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    try {
      console.log(`[Next.js API Route] Forwarding request to live FastAPI backend at ${backendUrl}/api/generate...`);
      const backendRes = await fetch(`${backendUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem_statement }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (backendRes.ok) {
        const data = await backendRes.json();
        console.log(`[Next.js API Route] Received live multi-agent response from FastAPI backend!`);
        return NextResponse.json(data);
      } else {
        const errText = await backendRes.text();
        console.error(`[Next.js API Route] Backend returned error status ${backendRes.status}: ${errText}`);
        return NextResponse.json(
          { error: `Backend service error (${backendRes.status}): ${errText}` },
          { status: backendRes.status }
        );
      }
    } catch (backendErr: any) {
      clearTimeout(timeoutId);
      console.error(`[Next.js API Route] Backend connection exception: ${backendErr.message}`);
      return NextResponse.json(
        { error: `Could not connect to FastAPI backend at ${backendUrl}. Please ensure FastAPI is running on port 8000. Error: ${backendErr.message}` },
        { status: 503 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate blueprint." }, { status: 500 });
  }
}
