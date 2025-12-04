"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, MessageCircle, BookOpen, Lightbulb } from "lucide-react";
import { ChatMessage, ContractAnalysis } from "@/types/contract";
import { readStreamableValue } from "ai/rsc";

interface ContractChatProps {
  contractText: string;
  analysis: ContractAnalysis | null;
}

export function ContractChat({ contractText, analysis }: ContractChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamingMessage, setStreamingMessage] = useState<string>("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStreamingMessage("");

    try {
      const response = await fetch("/api/contract/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractText,
          analysis,
          question: userMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const jsonStr = line.substring(2).trim();
                if (jsonStr) {
                  const parsed = JSON.parse(jsonStr);
                  if (parsed.answer) {
                    accumulatedText = parsed.answer;
                    setStreamingMessage(accumulatedText);
                  }
                }
              } catch (e) {
                // Continue parsing other lines
              }
            }
          }
        }
      }

      // Create assistant message from accumulated text
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: accumulatedText || "I apologize, but I couldn't generate a response.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessage("");
    } catch (error) {
      console.error("Chat error:", error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Ask About Your Contract
            </CardTitle>
            <CardDescription>
              Get answers about Egyptian law compliance, clauses, and legal requirements
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages Container */}
        <div className="h-[400px] overflow-y-auto space-y-4 p-4 border rounded-lg bg-muted/20">
          {messages.length === 0 && !streamingMessage && (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm mb-2">No messages yet</p>
              <p className="text-xs max-w-sm">
                Ask questions about the contract, specific clauses, Egyptian law compliance, or
                request clarifications on the analysis results.
              </p>
              <div className="mt-4 space-y-2 text-left">
                <p className="text-xs font-semibold">Example questions:</p>
                <ul className="text-xs space-y-1">
                  <li>• "What are the critical issues I need to fix first?"</li>
                  <li>• "Explain Article 223 of the Egyptian Civil Code"</li>
                  <li>• "How can I make the termination clause compliant?"</li>
                </ul>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.role === "assistant" && (
                    <BookOpen className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.structured?.lawReferences &&
                      message.structured.lawReferences.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <p className="text-xs font-semibold mb-1">Law References:</p>
                          {message.structured.lawReferences.map((ref, idx) => (
                            <Badge key={idx} variant="outline" className="mr-1 mb-1 text-xs">
                              {ref.article}
                            </Badge>
                          ))}
                        </div>
                      )}
                    {message.structured?.additionalSuggestions &&
                      message.structured.additionalSuggestions.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <p className="text-xs font-semibold mb-1 flex items-center gap-1">
                            <Lightbulb className="h-3 w-3" />
                            Suggestions:
                          </p>
                          <ul className="text-xs space-y-1">
                            {message.structured.additionalSuggestions.map((suggestion, idx) => (
                              <li key={idx}>• {suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Streaming Message */}
          {streamingMessage && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <div className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{streamingMessage}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-xs opacity-70">Typing...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && !streamingMessage && (
            <div className="flex justify-start">
              <div className="rounded-lg p-3 bg-muted">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Analyzing your question...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about the contract..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
