import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages } from "ai";
import { agentTools } from "./tools/agent-tools";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const model = anthropic("claude-haiku-4-5");

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages, { tools: agentTools }),
    tools: agentTools,
  });

  return result.toUIMessageStreamResponse();
}
