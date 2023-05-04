export const NodeTypeValue = {
  Lang: "Language", // プログラミング言語
  Impl: "Implementation", // 実装
  FrameWork: "Framework", // フレームワーク
  Paradigm: "Paradigm", // 言語パラダイム
} as const;
export type NodeType = (typeof NodeTypeValue)[keyof typeof NodeTypeValue];

export const RelationTypeValue = {
  Subset: "HAS_SUBSET", // ある言語の別の実装、方言。サブセット。
  Influenced: "INFLUENCED", //影響を与えた
  FrameWork: "HAS_FRAMEWORK", //その言語に関係するフレームワーク
  Paradigm: "SUPPORTS_PARADIGM", // 言語がサポートするパラダイム
};
export type RelationType =
  (typeof RelationTypeValue)[keyof typeof RelationTypeValue];

export type LanguageOpenAiResponse = {
  paradigm: Array<string>;
  majorDialects: Array<string>;
  strongInfluencedBy: Array<string>;
  strongInfluenced: Array<string>;
  majorFrameworks: Array<string>;
};
