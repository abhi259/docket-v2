import type { UIMessage } from "ai";

/** Max complete conversation turns kept for the model (user + assistant block each). */
const MAX_TURNS = 10;

const SUMMARY_MAX_CHARS = 900;

/**
 * Group UI messages into turns: each turn starts with a `user` message and includes every
 * following `assistant` until the next `user`. Leading `assistant` messages (no prior user)
 * form their own turn so they are never split from the user they belong with visually.
 */
function groupIntoTurns(messages: UIMessage[]): UIMessage[][] {
  const turns: UIMessage[][] = [];
  let i = 0;

  while (i < messages.length) {
    if (messages[i].role === "user") {
      const turn: UIMessage[] = [messages[i]!];
      i++;
      while (i < messages.length && messages[i]!.role === "assistant") {
        turn.push(messages[i]!);
        i++;
      }
      turns.push(turn);
    } else {
      const turn: UIMessage[] = [];
      while (i < messages.length && messages[i]!.role === "assistant") {
        turn.push(messages[i]!);
        i++;
      }
      if (turn.length > 0) turns.push(turn);
    }
  }

  return turns;
}

function collectTextFromUserMessage(m: UIMessage): string {
  return m.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text.trim())
    .filter(Boolean)
    .join(" ");
}

function collectToolNamesFromAssistant(m: UIMessage): string[] {
  const names: string[] = [];
  for (const p of m.parts) {
    if (typeof p.type === "string" && p.type.startsWith("tool-")) {
      names.push(p.type.slice("tool-".length));
    }
  }
  return names;
}

function summarizeDroppedTurns(droppedTurns: UIMessage[][]): string {
  const userBits: string[] = [];
  const tools = new Set<string>();

  for (const turn of droppedTurns) {
    for (const m of turn) {
      if (m.role === "user") {
        const t = collectTextFromUserMessage(m);
        if (t) userBits.push(t);
      } else {
        for (const n of collectToolNamesFromAssistant(m)) tools.add(n);
      }
    }
  }

  const excerpt = userBits.join(" · ").slice(0, SUMMARY_MAX_CHARS);
  const toolList = [...tools].slice(0, 20).join(", ");
  let s =
    "[Earlier turns were removed to fit context. Continue helpfully from the thread below.]\n";
  if (excerpt) s += `User (excerpts): ${excerpt}\n`;
  if (toolList) s += `Tools used earlier: ${toolList}.`;
  return s.slice(0, 1200);
}

function mergeSummaryIntoFirstUser(
  messages: UIMessage[],
  summary: string,
): UIMessage[] {
  if (messages.length === 0) {
    return [
      {
        id: `ctx-${crypto.randomUUID()}`,
        role: "user",
        parts: [{ type: "text", text: summary }],
      },
    ];
  }

  const [first, ...rest] = messages;
  if (first!.role === "user") {
    const prefix = { type: "text" as const, text: `${summary}\n\n` };
    const merged: UIMessage = {
      ...first,
      parts: [prefix, ...first.parts],
    };
    return [merged, ...rest];
  }

  const summaryMessage: UIMessage = {
    id: `ctx-${crypto.randomUUID()}`,
    role: "user",
    parts: [{ type: "text", text: summary }],
  };
  return [summaryMessage, ...messages];
}

/**
 * Keeps only the last `MAX_TURNS` whole turns so assistant messages (including all tool parts
 * in those UI messages) stay intact. Dropped turns are replaced by a short summary merged into
 * the first kept user message (or a new leading user message if the kept window starts with
 * assistant).
 */
export function prepareMessagesForModel(messages: UIMessage[]): UIMessage[] {
  if (!Array.isArray(messages) || messages.length === 0) {
    return messages;
  }

  const turns = groupIntoTurns(messages);
  if (turns.length <= MAX_TURNS) {
    return messages;
  }

  const droppedTurns = turns.slice(0, turns.length - MAX_TURNS);
  const keptTurns = turns.slice(-MAX_TURNS);
  const keptFlat = keptTurns.flat();
  const summary = summarizeDroppedTurns(droppedTurns);

  return mergeSummaryIntoFirstUser(keptFlat, summary);
}
