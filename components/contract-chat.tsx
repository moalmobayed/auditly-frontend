"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Loader2,
  MessageCircle,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { ChatMessage, ContractAnalysis } from "@/types/contract";

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
      console.log("=== CHAT: Sending request ===");
      console.log("Question:", userMessage.content);

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

      console.log("=== CHAT: Response status ===", response.status);

      const result = await response.json();
      console.log("=== CHAT: Response data ===", result);

      if (!response.ok) {
        console.error("=== CHAT: Error response ===", result);

        // Handle quota errors specifically
        if (response.status === 429 || result.errorType === "quota_exceeded") {
          throw new Error(
            result.error ||
              "تم تجاوز حد API. يرجى الانتظار لحظة والمحاولة مرة أخرى."
          );
        }

        throw new Error(result.error || "فشل في الحصول على استجابة");
      }

      // Get the answer from the JSON response
      const answerText = result.answer || "";

      console.log("=== CHAT: Answer received ===", answerText);

      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          answerText ||
          "عذراً، لم أتمكن من إنشاء استجابة. يرجى المحاولة مرة أخرى.",
        timestamp: new Date(),
        structured: {
          answer: answerText,
          relatedIssues: result.relatedIssues || [],
          lawReferences: result.lawReferences || [],
          additionalSuggestions: result.additionalSuggestions || [],
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessage("");
    } catch (error) {
      console.error("Chat error:", error);

      let errorContent =
        "عذراً، واجهت خطأ أثناء معالجة سؤالك. يرجى المحاولة مرة أخرى.";

      // Provide better error message for quota errors
      if (error instanceof Error) {
        if (
          error.message.includes("quota") ||
          error.message.includes("rate limit") ||
          error.message.includes("API")
        ) {
          errorContent =
            "⚠️ تم الوصول إلى حد API. يرجى الانتظار دقيقة أو دقيقتين قبل طرح سؤال آخر.\n\nيمكنك التحقق من استخدام API الخاص بك على: https://ai.dev/usage";
        } else {
          errorContent = `خطأ: ${error.message}`;
        }
      }

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorContent,
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
              اسأل عن عقدك
            </CardTitle>
            <CardDescription>
              احصل على إجابات حول الامتثال للقانون المصري والبنود والمتطلبات
              القانونية
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
              <p className="text-sm mb-2">لا توجد رسائل بعد</p>
              <p className="text-xs max-w-sm">
                اطرح أسئلة حول العقد أو بنود محددة أو الامتثال للقانون المصري أو
                اطلب توضيحات حول نتائج التحليل.
              </p>
              <div className="mt-4 space-y-2 text-right">
                <p className="text-xs font-semibold">أمثلة على الأسئلة:</p>
                <ul className="text-xs space-y-1">
                  <li>
                    • &quot;ما هي المشاكل الحرجة التي يجب إصلاحها أولاً؟&quot;
                  </li>
                  <li>
                    • &quot;اشرح المادة 223 من القانون المدني المصري&quot;
                  </li>
                  <li>
                    • &quot;كيف أجعل بند الإنهاء متوافقاً مع القانون؟&quot;
                  </li>
                </ul>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
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
                    <BookOpen className="h-4 w-4 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap text-arabic-auto">
                      {message.content}
                    </p>
                    {message.structured?.lawReferences &&
                      message.structured.lawReferences.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <p className="text-xs font-semibold mb-1">
                            مراجع قانونية:
                          </p>
                          {message.structured.lawReferences.map((ref, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="ml-1 mb-1 text-xs"
                            >
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
                            اقتراحات:
                          </p>
                          <ul className="text-xs space-y-1">
                            {message.structured.additionalSuggestions.map(
                              (suggestion, idx) => (
                                <li key={idx}>• {suggestion}</li>
                              )
                            )}
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
                  <BookOpen className="h-4 w-4 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap text-arabic-auto">
                      {streamingMessage}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span className="text-xs opacity-70">
                        جاري الكتابة...
                      </span>
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
                  <span className="text-sm">جاري تحليل سؤالك...</span>
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
            placeholder="اطرح سؤالاً عن العقد..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
          >
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
