const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzePayment = async (paymentContext) => {
  const prompt = `
You are an AI Revenue Recovery Agent.

Your task is to analyze a payment transaction and recommend the safest
next action.

You ONLY recommend actions.
You NEVER execute actions.

Payment context:
${JSON.stringify(paymentContext, null, 2)}

You MUST follow these decision rules:

1. If:
   customerStatus = DEBITED
   razorpayStatus = PENDING
   externalStatus = PENDING

   Action MUST be WAIT.

   Reason: The transaction may still be processing. Do not refund,
   recover, or escalate immediately.

2. If:
   customerStatus = DEBITED
   externalStatus = SUCCESS

   And there is no clear contradiction requiring human review:

   Action should be RECOVER.

3. If:
   customerStatus = DEBITED
   externalStatus = FAILED

   Action should be REFUND.

4. If:
   customerStatus = NOT_DEBITED
   AND externalStatus = FAILED

   Action should be INVESTIGATE.

   Reason: No customer money appears to have been debited, so recovery
   or refund should not automatically occur.

5. If payment systems contain clearly contradictory terminal states,
   such as SUCCESS in one system and FAILED in another:

   Action MUST be ESCALATE.

6. If the payment remains PENDING after the allowed maximum monitoring
   attempts, the backend will handle escalation separately.
   Do NOT escalate merely because a normal payment is currently PENDING.

7. Do not invent missing information.

8. Always choose exactly one action from:
   WAIT
   RECOVER
   REFUND
   ESCALATE
   INVESTIGATE

Return ONLY valid JSON in this exact format:

{
  "assessment": "brief analysis of the payment",
  "action": "WAIT | RECOVER | REFUND | ESCALATE | INVESTIGATE",
  "reason": "why this action is recommended",
  "confidence": 0.0
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const text = response.text;

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const decision = JSON.parse(cleanedText);

    // Safety validation
    const allowedActions = [
      "WAIT",
      "RECOVER",
      "REFUND",
      "ESCALATE",
      "INVESTIGATE",
    ];

    decision.action = decision.action.toUpperCase();

    if (!allowedActions.includes(decision.action)) {
      throw new Error(
        `Invalid agent action returned: ${decision.action}`
      );
    }

    return decision;
  } catch (error) {
    console.error("Gemini agent error:", error.message);
    throw error;
  }
};

module.exports = analyzePayment;