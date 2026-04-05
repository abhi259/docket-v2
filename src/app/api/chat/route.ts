import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { agentTools } from "./tools/agent-tools";
import { prepareMessagesForModel } from "./prepare-messages-for-model";

const systemPrompt = `You are a helpful food assistant. Use tools to search and display food items. Follow tool descriptions for the correct workflow.`;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const modelInput = prepareMessagesForModel(messages as UIMessage[]);

  const model = anthropic("claude-haiku-4-5");

  const result = streamText({
    model,
    system: systemPrompt,
    messages: await convertToModelMessages(modelInput, { tools: agentTools }),
    tools: agentTools,
    providerOptions: {
      anthropic: {
        cacheControl: { type: "ephemeral" },
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
