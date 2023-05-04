from gensim.models import Word2Vec

def similarity(model, word1, word2):
    similarity = model.wv.similarity(word1, word2)
    text = f"{word1}/{word2}"
    print(f"{text:<25}類似性: {similarity}") 

model = Word2Vec.load("node2vec_model")
similarity(model,'java', 'rust')
similarity(model,'java', 'spring')
similarity(model,'java', 'c')
similarity(model,'java', 'rust')
similarity(model,'java', 'kotlin')
similarity(model,'java', 'smalltalk')
similarity(model,'python', 'django')
similarity(model,'python', 'ruby')
similarity(model,'python', 'pypy')
similarity(model,'ruby', 'ruby on rails')
similarity(model,'ruby', 'javascript')
similarity(model,'ruby', 'typescript')
similarity(model,'ruby', 'c++')
similarity(model,'swift', 'ruby')
similarity(model,'swift', 'typescript')
similarity(model,'haskell', 'rust')

similarity(model,'javascript', 'typescript')
similarity(model,'javascript', 'vue')
similarity(model,'javascript', 'react')
similarity(model,'javascript', 'node.js')