import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import {
  LanguageOpenAiResponse,
  NodeTypeValue,
  RelationTypeValue,
} from "../types";
import { createNode, relation } from "@/app/lib/neo4j/query";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const generatePrompt = (lang: string) => `
Based on the information on wikipedia, please answer about the programming languages I have heard.

Please follow the JSON format below for your answers.
Answers will be used by the API and must be in JSON format.
If you have something you would like to explain, please include it in the NOTE in the json body.
\`\`\`
{
  "paradigm": [],
  "majorImplementations": [],
  "influencedBy": [],
  "influenced": [],
  "majorFrameworks":[],
  "note": ""
}
\`\`\`

Tell us about ${lang} according to the above.
`;

export async function POST(request: Request) {
  if (!configuration.apiKey) {
    return new Response("api key error", {
      status: 500,
    });
  }

  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang");

  if (!lang) {
    return new Response("error", {
      status: 404,
    });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: generatePrompt(lang) }],
    });

    if (!completion.data.choices[0].message?.content) {
      return new Response("response data error", {
        status: 500,
      });
    }

    const response: LanguageOpenAiResponse = JSON.parse(
      completion.data.choices[0].message.content
    );
    // openaiの回答をneo4jに記録する
    await createNode(lang, NodeTypeValue.Lang);
    // 影響を与えた言語について
    response.influenced.forEach(async (influence: string) => {
      await createNode(influence, NodeTypeValue.Lang);
      await relation(
        NodeTypeValue.Lang,
        lang,
        NodeTypeValue.Lang,
        influence,
        RelationTypeValue.Influenced
      );
    });
    // 影響を受けた言語について
    response.influencedBy.forEach(async (influence: string) => {
      await createNode(influence, NodeTypeValue.Lang);
      await relation(
        NodeTypeValue.Lang,
        influence,
        NodeTypeValue.Lang,
        lang,
        RelationTypeValue.Influenced
      );
    });
    // パラダイムについて
    response.paradigm.forEach(async (paradigm: string) => {
      await createNode(paradigm, NodeTypeValue.Paradigm);
      await relation(
        NodeTypeValue.Lang,
        lang,
        NodeTypeValue.Paradigm,
        paradigm,
        RelationTypeValue.Paradigm
      );
    });
    // フレームワークについて
    response.majorFrameworks.forEach(async (framework: string) => {
      await createNode(framework, NodeTypeValue.FrameWork);
      await relation(
        NodeTypeValue.Lang,
        lang,
        NodeTypeValue.FrameWork,
        framework,
        RelationTypeValue.FrameWork
      );
    });
    // 方言について
    response.majorImplementations.forEach(async (impl: string) => {
      await createNode(impl, NodeTypeValue.Impl);
      await relation(
        NodeTypeValue.Lang,
        lang,
        NodeTypeValue.Impl,
        impl,
        RelationTypeValue.Subset
      );
    });

    return NextResponse.json(response);
  } catch (e) {
    console.error(e);
    if (e instanceof SyntaxError) {
      return new Response("json parse error", {
        status: 500,
      });
    }
    return new Response("Unknown", {
      status: 500,
    });
  }
}
