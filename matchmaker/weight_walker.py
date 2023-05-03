import random

class WeightedRandomWalker:
    def __init__(self, graph, walk_length, num_walks):
        self.graph = graph
        self.walk_length = walk_length
        self.num_walks = num_walks

    def walk(self, start_node):
        walk = [start_node]
        for _ in range(self.walk_length - 1):
            current_node = walk[-1]
            neighbors = list(self.graph.neighbors(current_node))

            # 隣接ノードが存在しない場合、ウォークを終了
            if not neighbors:
                break

            weights = [self.graph[current_node][neighbor].get('weight', 0) for neighbor in neighbors]
            next_node = random.choices(neighbors, weights=weights)[0]
            walk.append(next_node)
        return walk

    def get_walks(self, nodes=None):
        if nodes is None:
            nodes = list(self.graph.nodes)
        walks = []
        for _ in range(self.num_walks):
            random.shuffle(nodes)
            for node in nodes:
                walks.append(self.walk(node))
        return walks