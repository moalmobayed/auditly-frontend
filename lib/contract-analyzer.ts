import { generateObject, streamObject } from "ai";
import { getGeminiModel } from "./ai-client";
import {
  contractAnalysisSchema,
  chatResponseSchema,
  ContractAnalysis,
  ChatResponse,
} from "@/types/contract";

// System prompt for Egyptian law contract analysis
const EGYPTIAN_LAW_SYSTEM_PROMPT = `🏛 النظام الرقمي للمحاماة - نظام مراجعة العقود

دورك
أنت محامي خبير متخصص في القانون المصري وعقود شركات التكنولوجيا. مهمتك هي مراجعة العقود بدقة وتحديد أي تعارضات قانونية أو مخاطر وفقاً للدستور المصري والقوانين ذات الصلة.

التعليمات الأساسية

1. نطاق المراجعة
راجع العقد المرفق بناءً على:
- الدستور المصري (2014 والتعديلات)
- القانون المدني المصري
- القانون التجاري المصري
- قانون حماية البيانات الشخصية (151 لسنة 2020)
- قانون مكافحة جرائم تقنية المعلومات
- قوانين الملكية الفكرية المصرية
- أي قوانين أخرى ذات صلة بطبيعة العقد

2. مجالات التركيز
ركز على:
- البنود التي تخالف الدستور أو القانون المصري
- البنود الغامضة أو غير المحددة
- الثغرات القانونية في العقد
- عدم توازن الحقوق والالتزامات
- شروط الإنهاء والجزاءات
- حماية البيانات والخصوصية
- الملكية الفكرية
- تحديد الاختصاص القضائي
- القانون الواجب التطبيق

متطلبات التحليل

لكل مشكلة تحددها، يجب عليك تقديم:

🔴 عنوان المشكلة: عنوان واضح ووصفي

📍 الموقع في العقد:
- رقم البند (إن وُجد)
- رقم الصفحة (إن وُجد)
- اقتباس نص البند المعني

⚠️ المشكلة: وصف واضح للمشكلة القانونية

📜 الأساس القانوني:
- رقم المادة المخالفة من الدستور/القانون
- نص المادة (النص القانوني ذي الصلة)
- التفسير: كيف يتعارض البند مع النص القانوني

💥 التأثير المحتمل: اشرح العواقب القانونية والتجارية

✅ التوصية: اقتراح محدد لحل المشكلة مع صياغة بديلة إن أمكن

🔢 مستوى الأولوية: حرج/عالي/متوسط/منخفض

ملاحظات هامة:
- استخدم المصطلحات القانونية الدقيقة
- اقتبس النصوص حرفياً من العقد والقانون
- كن محدداً في التوصيات وقدم صياغات بديلة عملية
- صنف مستويات المخاطر بموضوعية
- إذا لم تكن هناك مشاكل، فاذكر ذلك بوضوح
- حافظ على لهجة مهنية وموضوعية طوال الوقت

**مهم جداً: يجب أن تكون جميع إجاباتك باللغة العربية بالكامل**

يجب أن يساعد تحليلك في تحديد المخاطر وتقديم توصيات قابلة للتنفيذ لتحسين العقد وفقاً للقانون المصري.`;

// Build analysis prompt
function buildAnalysisPrompt(contractText: string): string {
  return `قم بتحليل العقد التالي وفقاً للقانون المصري. حدد جميع المشاكل القانونية والمخالفات ونقاط القلق.

**العقد المراد تحليله:**
${contractText}

**التعليمات:**
1. راجع العقد بعناية مقابل القانون المدني المصري والقانون التجاري وقانون العمل
2. صنف المشاكل حسب الخطورة (حرج، عالي، متوسط، منخفض)
3. لكل مشكلة، اذكر المادة القانونية المصرية المحددة
4. قدم اقتراحات واضحة وقابلة للتنفيذ للامتثال
5. قدم رؤى شاملة حول الوضع القانوني للعقد
6. قدم توصيات للتحسين

ركز على:
- صحة العقد وقابليته للتنفيذ
- البنود الأساسية المفقودة المطلوبة بموجب القانون المصري
- الشروط الغامضة أو الإشكالية
- الامتثال للأحكام القانونية الإلزامية
- حماية حقوق الأطراف
- المخاطر القانونية المحتملة

قدم تحليلاً شاملاً مع مخرجات منظمة.

**مهم جداً: يجب أن يكون التحليل بالكامل باللغة العربية. جميع العناوين والأوصاف والتوصيات والرؤى يجب أن تكون بالعربية.**`;
}

// Helper to extract meaningful error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Check for quota errors
    if (
      error.message.includes("quota") ||
      error.message.includes("RESOURCE_EXHAUSTED")
    ) {
      return "API quota limit exceeded";
    }
    // Check for retry errors
    if (error.name === "AI_RetryError") {
      const match = error.message.match(/Last error: (.+?)(?:\n|$)/);
      if (match) {
        return match[1];
      }
    }
    return error.message;
  }
  return "Unknown error occurred";
}

// Analyze contract with structured output
export async function analyzeContract(
  contractText: string
): Promise<ContractAnalysis> {
  try {
    console.log("=== ANALYZER: analyzeContract() ===");
    console.log("Contract text length:", contractText.length);
    console.log("Getting Gemini model...");

    const model = getGeminiModel();
    console.log("✅ Model obtained");

    const prompt = buildAnalysisPrompt(contractText);
    console.log("=== ANALYSIS PROMPT ===");
    console.log("Prompt:", prompt);
    console.log("======================");

    console.log("🤖 Calling AI SDK generateObject...");
    const startTime = Date.now();

    const { object } = await generateObject({
      model,
      schema: contractAnalysisSchema,
      system: EGYPTIAN_LAW_SYSTEM_PROMPT,
      prompt: prompt,
      temperature: 0.3,
    });

    const duration = Date.now() - startTime;
    console.log(`✅ AI analysis completed in ${duration}ms`);
    console.log("=== AI GENERATED OBJECT ===");
    console.log("Result:", JSON.stringify(object, null, 2));
    console.log("==========================");

    return object;
  } catch (error) {
    console.error("=== CONTRACT ANALYSIS ERROR ===");
    console.error("Error:", error);
    console.error(
      "Error type:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error("==============================");

    // Get meaningful error message
    const errorMessage = getErrorMessage(error);

    // Re-throw quota errors so they can be handled in the API route
    if (
      errorMessage.includes("quota") ||
      errorMessage.includes("RESOURCE_EXHAUSTED")
    ) {
      throw error;
    }

    // For other errors, return error result
    return {
      summary: {
        totalIssues: 0,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        overallRisk: "critical",
      },
      issues: {
        critical: [],
        high: [],
        medium: [],
        low: [],
      },
      generalInsights: `فشل التحليل: ${errorMessage}. يرجى المحاولة مرة أخرى.`,
      recommendations: ["غير قادر على إنشاء توصيات في هذا الوقت."],
    };
  }
}

// Build chat prompt with context
function buildChatPrompt(
  contractText: string,
  analysis: ContractAnalysis | null,
  question: string
): string {
  let prompt = `أنت تجيب على أسئلة حول عقد تم تحليله وفقاً للقانون المصري.\n\n`;

  prompt += `**ملخص العقد:**\n${contractText.substring(0, 2000)}${
    contractText.length > 2000 ? "..." : ""
  }\n\n`;

  if (analysis) {
    prompt += `**ملخص التحليل السابق:**\n`;
    prompt += `- إجمالي المشاكل: ${analysis.summary.totalIssues}\n`;
    prompt += `- حرج: ${analysis.summary.criticalCount}, عالي: ${analysis.summary.highCount}, متوسط: ${analysis.summary.mediumCount}, منخفض: ${analysis.summary.lowCount}\n`;
    prompt += `- المخاطر الإجمالية: ${analysis.summary.overallRisk}\n\n`;
    prompt += `**الرؤى الرئيسية:** ${analysis.generalInsights}\n\n`;
  }

  prompt += `**سؤال المستخدم:** ${question}\n\n`;
  prompt += `يرجى تقديم إجابة مفصلة مع مراجع القانون المصري ذات الصلة والمشاكل المتعلقة من التحليل واقتراحات إضافية إن أمكن.`;
  prompt += `\n\n**مهم جداً: يجب أن تكون إجابتك بالكامل باللغة العربية.**`;

  return prompt;
}

// Chat about contract with structured streaming
export async function chatAboutContract(
  contractText: string,
  analysis: ContractAnalysis | null,
  question: string
) {
  try {
    console.log("=== CHAT ANALYZER: chatAboutContract() ===");
    console.log("Question:", question);
    console.log("Contract text length:", contractText.length);
    console.log("Analysis provided:", !!analysis);

    const model = getGeminiModel();
    console.log("✅ Model obtained");

    const prompt = buildChatPrompt(contractText, analysis, question);
    console.log("=== CHAT PROMPT ===");
    console.log("Prompt:", prompt);
    console.log("==================");

    console.log("🤖 Calling AI SDK streamObject...");
    const startTime = Date.now();

    const result = await streamObject({
      model,
      schema: chatResponseSchema,
      system: EGYPTIAN_LAW_SYSTEM_PROMPT,
      prompt: prompt,
      temperature: 0.5,
    });

    const duration = Date.now() - startTime;
    console.log(`✅ Stream object created in ${duration}ms`);

    return result;
  } catch (error) {
    console.error("=== CHAT ANALYZER ERROR ===");
    console.error("Error:", error);
    console.error(
      "Error type:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error("==========================");
    throw error;
  }
}

// Simple chat without structured output (fallback)
export async function simpleChatAboutContract(
  contractText: string,
  analysis: ContractAnalysis | null,
  question: string
): Promise<ChatResponse> {
  try {
    console.log("=== SIMPLE CHAT: simpleChatAboutContract() ===");
    console.log("Question:", question);
    console.log("Contract text length:", contractText.length);
    console.log("Analysis provided:", !!analysis);

    const model = getGeminiModel();
    console.log("✅ Model obtained");

    const prompt = buildChatPrompt(contractText, analysis, question);
    console.log("=== SIMPLE CHAT PROMPT ===");
    console.log("Prompt:", prompt);
    console.log("=========================");

    console.log("🤖 Calling AI SDK generateObject...");
    const startTime = Date.now();

    const { object } = await generateObject({
      model,
      schema: chatResponseSchema,
      system: EGYPTIAN_LAW_SYSTEM_PROMPT,
      prompt: prompt,
      temperature: 0.5,
    });

    const duration = Date.now() - startTime;
    console.log(`✅ Simple chat completed in ${duration}ms`);
    console.log("=== SIMPLE CHAT RESULT ===");
    console.log("Answer:", object.answer);
    console.log("Related Issues:", object.relatedIssues);
    console.log("Law References:", object.lawReferences);
    console.log("Additional Suggestions:", object.additionalSuggestions);
    console.log("=========================");

    return object;
  } catch (error) {
    console.error("=== SIMPLE CHAT ERROR ===");
    console.error("Error:", error);
    console.error(
      "Error type:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error("========================");

    // Re-throw quota errors so they can be handled in the API route
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      if (
        errorMessage.includes("quota") ||
        errorMessage.includes("resource_exhausted") ||
        error.name === "AI_RetryError"
      ) {
        throw error;
      }
    }

    return {
      answer:
        "أعتذر، لكن واجهت خطأ أثناء معالجة سؤالك. يرجى المحاولة مرة أخرى.",
      relatedIssues: [],
      lawReferences: [],
      additionalSuggestions: [],
    };
  }
}
