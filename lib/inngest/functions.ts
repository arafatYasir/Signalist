import { getAllUsersForNewsEmail } from "../actions/user.actions";
import { sendWelcomeEmail } from "../nodemailer";
import { inngest } from "./client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";

export const sendSignUpEmail = inngest.createFunction(
    { id: "sign-up-email" },
    { event: "app/user.created" },
    async ({ event, step }) => {
        const userProfile = `
            - Country: ${event.data.country}
            - Investment Goals: ${event.data.investmentGoals}
            - Risk Tolerance: ${event.data.riskTolerance}
            - Preferred Industry: ${event.data.preferredIndustry}
        `;

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace("{{userProfile}}", userProfile);

        const response = await step.ai.infer("generate-welcome-intro", {
            model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
            body: {
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            }
        });

        await step.run("send-welcome-email", async () => {
            const part = response.candidates?.[0].content?.parts?.[0];
            const introText = (part && "text" in part ? part.text : null) || "Thanks for joining signlist. You now have access to our real-time alerts for stocks and companies you're interested in."

            const { data: { email, name } } = event;
            return await sendWelcomeEmail({
                email, name, intro: introText
            });
        });

        return {
            success: true,
            message: "Welcome email sent successfully!"
        }
    }
);

export const sendDailyNewsSummary = inngest.createFunction(
    { id: "daily-news-summary" },
    [
        { event: "app/send.daily.news" },
        { cron: "0 12 * * *" }
    ],
    async ({ step }) => {
        // Get all the users for news delivery
        const users = await step.run("get-all-users", getAllUsersForNewsEmail);

        if(!users || users.length === 0) {
            return {
                success: false,
                message: "No users found for news delivery"
            };
        }
        
        // Fetch personalized news for each user
        
        // Summarize these news via AI for each user
        // Send the emails summary
    }
)