import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      domainHistory,
      listSize,
      listAge,
      engagementLevel,
      esp,
      dailyVolumeTarget,
      useCase,
      industry,
      ispMix,
      previousIssues,
    } = body;

    const userPrompt = `Generate a detailed email warmup strategy for the following profile:

**Domain & IP History:** ${domainHistory}
**List Size:** ${listSize} subscribers
**List Age:** ${listAge}
**Engagement Level:** ${engagementLevel}
**Email Service Provider (ESP):** ${esp}
**Daily Volume Target:** ${dailyVolumeTarget} emails/day
**Use Case:** ${useCase}
**Industry:** ${industry}
**ISP Mix:** ${ispMix}
**Previous Issues:** ${previousIssues || "None reported"}

Please provide a comprehensive warmup strategy as valid JSON only. No markdown, no explanation outside the JSON structure.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      system: `You are a senior email deliverability consultant. Return ONLY valid JSON with this structure: { summary, duration, keyRules[], weeklyPlan[{week, dailyVolume, totalVolume, minOpenRate, segments, focus, warning}], ispTips{gmail,outlook,yahoo}, redFlags[], successMetrics[] }`,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "Unexpected response type from AI" },
        { status: 500 }
      );
    }

    let strategy;
    try {
      // Strip any potential markdown code blocks
      const jsonText = content.text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      strategy = JSON.parse(jsonText);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response as JSON", raw: content.text },
        { status: 500 }
      );
    }

    return NextResponse.json({ strategy });
  } catch (error) {
    console.error("Error generating warmup strategy:", error);
    return NextResponse.json(
      { error: "Failed to generate warmup strategy. Please try again." },
      { status: 500 }
    );
  }
}
