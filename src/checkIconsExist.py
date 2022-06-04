from os.path import exists, join
from json import load

with open("C:\\Users\\mweas\\OneDrive\\Documents\\code_repos\\HexMapBuilderVue\\src\\assets\\hexConfig.json") as f:
    config = load(f)

contentTags = config['contentTags']
icons = config['icons']

for category in contentTags.keys():
    for (k, v) in contentTags[category].items():
        print(k)
        icons[v['icon']]
