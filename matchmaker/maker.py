from gensim.models import Word2Vec

loaded_model = Word2Vec.load("node2vec_model")
similarity = loaded_model.wv.similarity('java', 'rust')
print("java/rust 類似性:", similarity)

similarity = loaded_model.wv.similarity('java', 'spring')
print("java/spring 類似性:", similarity)

similarity = loaded_model.wv.similarity('java', 'c')
print("java/c 類似性:", similarity)

similarity = loaded_model.wv.similarity('python', 'django')
print("python/django 類似性:", similarity)

similarity = loaded_model.wv.similarity('python', 'ruby')
print("python/ruby 類似性:", similarity)