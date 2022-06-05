import json
import re

config_file = "C:\\Users\\mweas\\OneDrive\\Documents\\code_repos\\HexMapBuilderVue\\src\\assets\\hexConfig.json"


with open(config_file) as f:
    config = json.load(f)

globalFillLists = config['globalFillLists']
contentTags = config['contentTags']

for category in contentTags.keys():
    for (k, v) in contentTags[category].items():
        print(">>>>>", k)
        for description in v['description']:
            if len(re.findall("#\w+", description['text'])) > 0:
                for match in re.findall("#\w+", description['text']):
                    print(match)
                    if len(v[re.sub("#", "", match)]) == 0:
                        print("!!!!!!!!!!!!! No entries!")
            if len(re.findall('!\w+', description['text'])) > 0:
                for match in re.findall("!\w+", description['text']):
                    print(match)
                    if len(globalFillLists[re.sub("!", "", match)]) == 0:
                        print("!!!!!!!!!!!!! No entries!")
        for hook in v['hook']:
            if len(re.findall('#\w+', hook['text'])) > 0:
                for match in re.findall("#\w+", hook['text']):
                    print(match)
                    if len(v[re.sub("#", "", match)]) == 0:
                        print("!!!!!!!!!!!!! No entries!")
            if len(re.findall('!\w+', hook['text'])) > 0:
                for match in re.findall("!\w+", hook['text']):
                    print(match)
                    if len(globalFillLists[re.sub("!", "", match)]) == 0:
                        print("!!!!!!!!!!!!! No entries!")
