import os
from notion_client import Client
import json
from time import sleep

# Params
config_file = "C:\\Users\\mweas\\OneDrive\\Documents\\code_repos\\HexMapBuilderVue\\src\\assets\\hexConfig.json"

# Functions


def getNotionContent(database_id):
    notion = Client(auth=os.environ["NOTION_TOKEN"])

    start_cursor = None
    has_more = True
    content = []
    while (has_more):
        partial_content = notion.databases.query(
            **{
                "database_id": database_id,
                "start_cursor": start_cursor
            }
        )
        content.append(partial_content['results'])
        has_more = partial_content['has_more']
        if (has_more):
            start_cursor = partial_content['next_cursor']
            sleep(0.5)
    content = [item for sublist in content for item in sublist]
    return content


# Get content types
type_result = getNotionContent("ce05cf613a7a42d29516ff3ca35ce2e7")


# Get content descriptions and hooks
content_result = getNotionContent("7f68cff9ee9f4a09929cd5f2c92861b2")

# Get choice lists
choice_list_result = getNotionContent("1e921bbc85e14ff9b432882cccce17e4")

global_choice_lists = {}
full_content = {
    "ruin": {},
    "settlement": {},
    "wilderness": {}
}
relations_name_to_id = {}
relations_id_to_name = {}

# Build the basic list of content types
for type in type_result:
    type_category = type['properties']['Category']['select']['name']
    type_name = type['properties']['Name']['title'][0]['plain_text']
    type_names = type['properties']['Names']['rich_text'][0]['plain_text'].split(
        ',')
    type_icon = type['properties']['Icon']['rich_text'][0]['plain_text']
    type_odds = type['properties']['Odds']['number']
    full_content[type_category][type_name] = {
        "names": type_names,
        "icon": type_name,
        "odds": type_odds,
        "description": [],
        "hook": []
    }
    relations_name_to_id[type['properties']['Name']
                         ['title'][0]['plain_text']] = type['id']
    relations_id_to_name[type['id']
                         ] = type['properties']['Name']['title'][0]['plain_text']

# Fill in descriptions and hooks
for category in full_content.keys():
    for type in full_content[category].keys():
        temp = [x for x in content_result if x['properties']
                ['Hex content types']['relation'][0]['id'] == relations_name_to_id[type]]
        for entry in temp:
            if entry['properties']['Property Type']['select']['name'] == 'Description':
                full_content[category][type]['description'].append(
                    {'text': entry['properties']['Text']['rich_text'][0]['plain_text'],
                     'odds': entry['properties']['Odds']['number']}
                )
            else:
                full_content[category][type]['hook'].append(
                    {'text': entry['properties']['Text']['rich_text'][0]['plain_text'],
                     'odds': entry['properties']['Odds']['number']}
                )

# Add choice lists - global and content-specific
for list in choice_list_result:
    list_name = list['properties']['Name']['title'][0]['plain_text']
    list_entries = list['properties']['Entries']['rich_text'][0]['plain_text'].split(
        ',\n')
    list_relation = list['properties']['Hex content types']['relation']
    if list_relation != []:
        list_relation = relations_id_to_name[list_relation[0]['id']]
    if list_relation == []:
        global_choice_lists[list_name] = list_entries
    else:
        for category in full_content.keys():
            if list_relation in full_content[category].keys():
                full_content[category][list_relation][list_name] = list_entries

# Load current config file, update it, and save the updated version
with open(config_file, 'r') as f:
    config = json.load(f)
with open(config_file, 'w') as f:
    config['globalFillLists'] = global_choice_lists
    config['contentTags'] = full_content
    json.dump(config, f, indent=5)
