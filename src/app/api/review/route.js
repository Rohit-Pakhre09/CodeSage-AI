import { getAIResponse } from "@/lib/ai/aiClient";
import { buildReviewPrompt } from "@/lib/ai/promptBuilder";
import { ReviewResponseSchema } from "@/lib/validators/reviewResponse.schema";
import { NextResponse } from "next/server";
export async function POST(request) {
    try {
        const body = await request.json();
        const { code, language, level } = body;
        if (!code || !language || !level) {
            return NextResponse.json({ error: "Missing required fields!" }, { status: 400 });
        }
        const prompt = buildReviewPrompt({
            code,
            language,
            level,
        });
        const aiRawResponse = await getAIResponse(prompt);
        const parsedResponse = JSON.parse(aiRawResponse);
        const validateResponse = ReviewResponseSchema.parse(parsedResponse);
        return NextResponse.json(validateResponse, { status: 200 });
    }
    catch (error) {
        console.error("API Review Error: ", error);
        return NextResponse.json({ error: "Failed to review code" }, { status: 500 });
    }
}
