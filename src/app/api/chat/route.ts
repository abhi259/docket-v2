  import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages } from "ai";
import { agentTools } from "./tools/agent-tools";

const systemPrompt = `You are a helpful food assistant. Use tools to search and display food items. Follow tool descriptions for the correct workflow.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const model = anthropic("claude-haiku-4-5");

  const result = streamText({
    model,
    system: systemPrompt,
    messages: await convertToModelMessages(messages, { tools: agentTools }),
    tools: agentTools,
    providerOptions: {
      anthropic: {
        cacheControl: { type: "ephemeral" },
      },
    },
    
  });

  return result.toUIMessageStreamResponse();
}
