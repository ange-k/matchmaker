import requests

base_url = "http://localhost:3000/api/openai/lang"
#query_params = ["python", "ruby", "perl", "php", "java", "go", "rust", "javascript", "typescript", "c"]
query_params = ["swift","julia","nim","c++","abc","modula-3","ada","eiffel","lisp","smalltalk","scala","groovy","objective-c","kotlin","clojure","ada 83","c#","pascal","ocaml","haskell","scheme","self","jscript","actionscript","ecmascript","b","bcpl","object pascal","inferno","dart","objective-j","coffeescript","algol 68","assembly"]
timeout_seconds = 35

for param in query_params:
    url = f"{base_url}?lang={param}"
    try:
        response = requests.post(url, timeout=timeout_seconds)
        response.raise_for_status()  # Raise an exception if the response contains an HTTP error
        print(response.text)
    except requests.exceptions.RequestException as e:
        print(f"Error occurred while executing query: {url}")
        print(f"Error details: {e}")