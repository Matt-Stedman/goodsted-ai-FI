import json

with open("./data/project_202307061838.json", encoding='utf-8') as f:
    data = json.load(f)

    print(len(data))