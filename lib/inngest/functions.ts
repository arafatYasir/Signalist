import { getNews } from "../actions/finnhub.actions";
import { getAllUsersForNewsEmail } from "../actions/user.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import { getFormattedTodayDate } from "../utils";
import { inngest } from "./client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";

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

        if (!users || users.length === 0) {
            return {
                success: false,
                message: "No users found for news delivery"
            };
        }

        // Fetch personalized news for each user
        const results = await step.run("fetch-user-news", async () => {
            const perUser = [];

            for (const user of users) {
                try {
                    const symbols = await getWatchlistSymbolsByEmail(user.email);
                    let articles = await getNews(symbols);

                    // Force to max 6 articles per user
                    articles = (articles || []).slice(0, 6);

                    if (!articles || articles.length === 0) {
                        articles = await getNews();
                        articles = (articles || []).slice(0, 6);
                    }

                    perUser.push({ user, articles });
                } catch (e) {
                    console.error('daily-news: error preparing user news', user.email, e);
                    perUser.push({ user, articles: [] });
                }
            }

            return perUser;
        });

        // Summarize these news via AI for each user
        const userNewsSummaries: any[] = [];

        for (const { user, articles } of results) {
            try {
                const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace("{{newsData}}", JSON.stringify(articles, null, 2));

                const response = await step.ai.infer(`summarize-news-${user.email}`, {
                    model: step.ai.models.gemini({
                        model: "gemini-2.5-flash-lite"
                    }),
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

                const part = response.candidates?.[0]?.content?.parts?.[0];
                const newsContent = (part && "text" in part ? part.text : null) || "No market news.";

                userNewsSummaries.push({ user, newsContent });
            } catch (e) {
                console.error('Failed to summarize news for : ', user.email);
                userNewsSummaries.push({ user, newsContent: null });
            }
        }

        // Send the emails summary
        await step.run("send-news-emails", async () => {
            await Promise.all(
                userNewsSummaries.map(async ({ user, newsContent }) => {
                    if (!newsContent) return false;

                    return await sendNewsSummaryEmail({
                        email: user.email,
                        date: getFormattedTodayDate(),
                        newsContent
                    });

                })
            );
        })

        return { success: true, message: "Daily news summary sent successfully!" };
    }
)