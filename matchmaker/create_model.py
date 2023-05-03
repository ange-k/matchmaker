from weight_walker import WeightedRandomWalker
from neo4j import GraphDatabase
import networkx as nx
from node2vec import Node2Vec

uri = "bolt://localhost:7687"
user = "neo4j"
password = "password"
driver = GraphDatabase.driver(uri, auth=(user, password))

class WeightedNode2Vec(Node2Vec):
    def __init__(self, *args, walker, **kwargs):
        self.walker = walker
        super().__init__(*args, **kwargs)

    def _generate_walks(self, graph=None, alias_nodes=None, alias_edges=None):
        return self.walker.get_walks()


def create_weighted_graph(tx):
    result = tx.run("MATCH (n)-[r]->(m) RETURN n.name, r.weight as weight, m.name")
    G = nx.DiGraph()
    for record in result:
        print(record)
        G.add_edge(record['n.name'].lower(), record['m.name'].lower(), weight=record['weight'])
    return G

with driver.session() as session:
    G = session.read_transaction(create_weighted_graph)

walk_length = 30
num_walks = 200

walker = WeightedRandomWalker(G, walk_length=walk_length, num_walks=num_walks)
walks = walker.get_walks()
node2vec = WeightedNode2Vec(graph=G, dimensions=32, walk_length=walk_length, num_walks=num_walks, workers=4, walker=walker)
model = node2vec.fit(window=5, min_count=1, batch_words=4)
model.save("node2vec_model")