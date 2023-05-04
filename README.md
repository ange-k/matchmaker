# 概要

なんかフロントエンドに出そうかなと Next を使ったけどそんなこともしなかったので Express とかでよかったかも。

API を公開していて、OpenAI を使って Neo4J とデータのやり取りをします。

`-XPOST http://localhost:3000/api/openai/lang?lang=xxx` で、指定の言語を OpenAI に聞いて、その結果をグラフデータベースに書き込みます。

`http://localhost:3000/api/openai/lang` に Get すると、リレーションを持ってない言語の配列を返します。

[curl.py](matchmaker/curl.py)を使用することで効率的に curl を実行できます。

## Node2Vec モデルの作成

Neo4J にデータを書き込めたら、[create_model.py](matchmaker/create_model.py)を実行し、Node2Vec のモデルを作成することができます。

ハイパーパラメータの調整をすることでいく分かマシになるかもしれません。

作ったモデルは maker.py を実行することでサンプル評価を出力することができます。

# 設定

python のあれこれに pip install 必要なパッケージがあります。
devcontainer は Node、Neo4J の環境しか用意しません…。

openai の API キーが必要です。

### .env.local

```
OPENAI_API_KEY=xxx
```
