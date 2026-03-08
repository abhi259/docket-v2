"use client";

import { useRef } from "react";
import type { UIMessage } from "@ai-sdk/react";
import FoodCard from "../../../lib/common-ui/FoodCard";
import YesNoPrompt from "../../../lib/common-ui/YesNoPrompt";
import ComparisonChart from "../../../lib/common-ui/ComparisonChart";
import { useCartStore, useCheckoutPopupStore } from "../../../store/store";

interface ChatContentProps {
  messages: UIMessage[];
  addToolOutput: (output: {
    tool: string;
    toolCallId: string;
    output: any;
  }) => void;
}

export default function ChatContent({
  messages,
  addToolOutput,
}: ChatContentProps) {
  const { addToCart, decrementItem, removeAllOfItem, clearCart } =
    useCartStore();
  const processedToolCalls = useRef<Set<string>>(new Set());
  const { setIsCheckoutOpen } = useCheckoutPopupStore();

  const handleProceedToCheckout = (toolName: string, toolCallId: string) => {
    if (processedToolCalls.current.has(toolCallId)) return;
    processedToolCalls.current.add(toolCallId);

    setTimeout(() => {
      setIsCheckoutOpen(true);
    }, 3000);

    addToolOutput({
      tool: toolName,
      toolCallId: toolCallId,
      output: { success: true },
    });
  };

  const handleCartToolCall = async (
    toolName: string,
    toolCallId: string,
    input: any,
  ) => {
    if (processedToolCalls.current.has(toolCallId)) return;
    processedToolCalls.current.add(toolCallId);

    switch (toolName) {
      case "addToCart": {
        try {
          const response = await fetch("/api/get-food");
          const data = await response.json();
          const foodItem = data.foods.find((f: any) => f.id === input?.id);

          if (foodItem) {
            const quantity = input?.quantity || 1;
            for (let i = 0; i < quantity; i++) {
              addToCart(foodItem);
            }
            addToolOutput({
              tool: "addToCart",
              toolCallId,
              output: { success: true, item: foodItem.name, quantity },
            });
          } else {
            addToolOutput({
              tool: "addToCart",
              toolCallId,
              output: {
                success: false,
                error: `Item with id ${input?.id} not found`,
              },
            });
          }
        } catch (err) {
          addToolOutput({
            tool: "addToCart",
            toolCallId,
            output: { success: false, error: "Failed to fetch food data" },
          });
        }
        break;
      }

      case "removeFromCart": {
        decrementItem(input.id);
        addToolOutput({
          tool: "removeFromCart",
          toolCallId,
          output: { success: true, itemId: input.id },
        });
        break;
      }
      case "removeAllFromCart": {
        removeAllOfItem(input.id);
        addToolOutput({
          tool: "removeAllFromCart",
          toolCallId,
          output: { success: true, itemId: input.id },
        });
        break;
      }
      case "clearCart": {
        clearCart();
        addToolOutput({
          tool: "clearCart",
          toolCallId,
          output: { success: true },
        });
        break;
      }
    }
  };

  return (
    <>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`flex gap-3 max-w-[85%] ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === "user"
                  ? "bg-indigo-600"
                  : "bg-linear-to-br from-indigo-500 to-purple-600"
              }`}
            >
              {message.role === "user" ? (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-200 text-gray-800 shadow-sm"
              }`}
            >
              <div className="whitespace-pre-wrap wrap-break-word text-[15px] leading-relaxed">
                {message.parts.map((part: any, i: number) => {
                  if (part.type === "text") {
                    return (
                      <span className="py-2" key={`${message.id}-${i}`}>
                        {part.text}
                      </span>
                    );
                  }

                  if (
                    part.type === "tool-renderFoodCards" &&
                    part.state === "output-available"
                  ) {
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 my-4 rounded-2xl bg-[#F2EEE9]"
                      >
                        {part.output.map((food: any) => (
                          <FoodCard key={food.id} foodData={food} />
                        ))}
                      </div>
                    );
                  }

                  if (part.type === "tool-askForComparison") {
                    if (part.state === "input-available") {
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className="w-[600px] mx-auto mt-4"
                        >
                          <YesNoPrompt
                            question="Do you want to compare these dishes?"
                            onYes={() =>
                              addToolOutput({
                                tool: "askForComparison",
                                toolCallId: part.toolCallId,
                                output: {
                                  confirmed: true,
                                  ids: part.input?.ids,
                                },
                              })
                            }
                            onNo={() =>
                              addToolOutput({
                                tool: "askForComparison",
                                toolCallId: part.toolCallId,
                                output: { confirmed: false },
                              })
                            }
                          />
                        </div>
                      );
                    }
                    return null;
                  }

                  if (
                    part.type === "tool-compareDishes" &&
                    part.state === "output-available"
                  ) {
                    return (
                      <div className="my-10" key={`${message.id}-${i}`}>
                        <ComparisonChart dishes={part.output.dishes} />
                      </div>
                    );
                  }

                  if (
                    part.type === "tool-addToCart" &&
                    part.state === "input-available"
                  ) {
                    handleCartToolCall(
                      "addToCart",
                      part.toolCallId,
                      part.input,
                    );
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 my-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Adding to cart...
                      </div>
                    );
                  }

                  if (
                    part.type === "tool-addToCart" &&
                    part.state === "output-available"
                  ) {
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 my-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {part.output.success
                          ? `Added ${part.output.quantity}x ${part.output.item} to cart`
                          : `Failed: ${part.output.error}`}
                      </div>
                    );
                  }

                  if (
                    part.type === "tool-removeFromCart" &&
                    part.state === "input-available"
                  ) {
                    handleCartToolCall(
                      "removeFromCart",
                      part.toolCallId,
                      part.input,
                    );
                    return null;
                  }

                  if (
                    part.type === "tool-removeFromCart" &&
                    part.state === "output-available"
                  ) {
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 my-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12H4"
                          />
                        </svg>
                        Removed item from cart
                      </div>
                    );
                  }

                  if (
                    part.type === "tool-removeAllFromCart" &&
                    part.state === "input-available"
                  ) {
                    handleCartToolCall(
                      "removeAllFromCart",
                      part.toolCallId,
                      part.input,
                    );
                    return null;
                  }

                  if (
                    part.type === "tool-removeAllFromCart" &&
                    part.state === "output-available"
                  ) {
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 my-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Removed all instances from cart
                      </div>
                    );
                  }

                  if (
                    part.type === "tool-clearCart" &&
                    part.state === "input-available"
                  ) {
                    handleCartToolCall(
                      "clearCart",
                      part.toolCallId,
                      part.input,
                    );
                    return null;
                  }

                  if (
                    part.type === "tool-clearCart" &&
                    part.state === "output-available"
                  ) {
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 my-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Cart cleared
                      </div>
                    );
                  }

                  if (
                    part.type === "tool-proceedToCheckout" &&
                    part.state === "input-available"
                  ) {
                    handleProceedToCheckout(
                      "proceedToCheckout",
                      part.toolCallId,
                    );
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="flex items-center gap-2 text-gray-600"
                      >
                        <svg
                          className="w-4 h-4 animate-spin text-orange-500"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Getting your order ready for checkout...</span>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
