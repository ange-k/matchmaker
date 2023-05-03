import neo4j, { Driver } from "neo4j-driver";

const driver: Driver = neo4j.driver(
  "neo4j://neo4j:7687", // Neo4jの接続URL
  neo4j.auth.basic("neo4j", "password") // ユーザー名とパスワード
);

export default driver;
