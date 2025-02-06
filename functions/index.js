const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const OpenAI = require("openai");
const cors = require("cors");

// Define secret without accessing it at deployment time
const openaiApiKey = defineSecret("OPENAI_API_KEY");

// Initialize CORS middleware
const corsMiddleware = cors({ origin: true });

exports.openaiEndpoint = onRequest({ secrets: [openaiApiKey] }, async (req, res) => {
  corsMiddleware(req, res, async () => {
    try {
      const { message, pageContent } = req.body;

      // Access the secret value at runtime inside the function
      const openai = new OpenAI({
        apiKey: openaiApiKey.value(),
      });

      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. Provide very succinct responses, highlighting only the most important aspects of the user's projects. Guide the reader to focus on key points and avoid unnecessary details.",
          },
          {
            role: "user",
            content: `Here is some context from the project page: ${pageContent}. Please focus on this content when responding to the user's queries, ensuring that the key points and details from the project are highlighted.`,
          },
          { role: "user", content: message },
        ],
        stream: true, // Enable streaming
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        res.write(content);
      }
      res.end();
    } catch (error) {
      console.error("Error interacting with OpenAI:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      res.status(500).send("Internal Server Error");
    }
  });
});

// New endpoint for generating prompts and main points
exports.generateInsights = onRequest({ secrets: [openaiApiKey] }, async (req, res) => {
  corsMiddleware(req, res, async () => {
    try {
      const { pageContent } = req.body;
      console.log("Received page content:", pageContent); // Log the received content

      // Access the secret value at runtime inside the function
      const openai = new OpenAI({
        apiKey: openaiApiKey.value(),
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. Please respond with a JSON object containing two fields: 'prompts' and 'mainPoints'. Each field should be an array of four strings based on the content provided.",
          },
          {
            role: "user",
            content: `Here is some context from the page: ${pageContent}. Please analyze this content and provide insights and prompts that are relevant and useful for understanding the key points and potential questions that could be asked.`,
          },
        ],
        stream: false, // Disable streaming for a single response
      });

      let content = response.choices[0]?.message?.content || "";

      // Remove Markdown code block formatting if present
      content = content.replace(/```json|```/g, "").trim();

      // Parse the JSON response from OpenAI
      const insights = JSON.parse(content);

      res.status(200).json({
        prompts: insights.prompts || [],
        mainPoints: insights.mainPoints || [],
      });
    } catch (error) {
      console.error("Error interacting with OpenAI:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      res.status(500).send("Internal Server Error");
    }
  });
});
