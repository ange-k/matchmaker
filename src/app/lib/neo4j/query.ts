import driver from "./db";
import {
  NodeType,
  RelationType,
  RelationTypeValue,
} from "@/app/api/openai/types";

/**
 * 該当の言語が存在しているかどうかを見る
 * @param lang
 * @returns count
 */
export const findNode = async (lang: string, type: NodeType) => {
  const query = `
      MATCH (l:${type})
      WHERE toLower(l.name) = toLower($name)
      RETURN count(l) > 0 as exists
    `;
  const session = driver.session();

  try {
    const result = await session.run(query, { name: lang });
    const count: number = result.records[0].get("exists");

    return count;
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await session.close();
  }
};

/**
 * 新規ノードの作成
 * @param lang
 */
export const createNode = async (
  lang: string,
  type: NodeType
): Promise<void> => {
  const count = await findNode(lang, type);
  if (count > 0) {
    console.log(`node exsist ${lang}`);
    return;
  }
  const query = `
    CREATE (l:${type} { name: $name })
  `;
  const session = driver.session();

  try {
    await session.run(query, { name: lang.toLowerCase() });
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await session.close();
  }
};

const weight = (type: RelationType) => {
  switch (type) {
    case RelationTypeValue.Subset:
      return "50.0";
    case RelationTypeValue.Influenced:
      return "1.0";
    case RelationTypeValue.FrameWork:
      return "100.0";
    case RelationTypeValue.Paradigm:
      return "5.0";
  }
};

/**
 *
 * @param node1 影響を与えるノード
 * @param node1name ノード名
 * @param node2 影響を受けるノード
 * @param node2name ノード名
 * @param relation リレーション名
 * @param weight 重み
 */
export const relation = async (
  node1: NodeType,
  node1name: string,
  node2: NodeType,
  node2name: string,
  relation: RelationType
): Promise<void> => {
  const query = `
  MATCH (l:${node1}), (i:${node2})
  WHERE toLower(l.name) = toLower($node1name) AND toLower(i.name) = toLower($node2name)
  MERGE (l)-[r:${relation}]->(i)
  ON CREATE SET r.weight = ${weight(relation)}
  `;
  const session = driver.session();

  try {
    await session.run(query, {
      node1name: node1name.toLowerCase(),
      node2name: node2name.toLowerCase(),
    });
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await session.close();
  }
};

/**
 * リレーションが作成されていないノードの検索
 * @returns languages
 */
export const findNonRelationNode = async (): Promise<Array<string>> => {
  const query = `
  MATCH (l:Language)
  WHERE NOT (l)-[:SUPPORTS_PARADIGM]-()
  RETURN l.name as name
  `;
  const session = driver.session();
  try {
    const res = await session.run(query);
    return res.records.map((record) => record.get("name"));
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await session.close();
  }
};
