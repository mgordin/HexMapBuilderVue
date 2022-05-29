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


# Get current types in Notion
type_result = getNotionContent("ce05cf613a7a42d29516ff3ca35ce2e7")

# Load config file
with open(config_file, 'r') as f:
    config = json.load(f)

notion = Client(auth=os.environ["NOTION_TOKEN"])

# Update types table in Notion
for (category, types) in config['contentTags'].items():
    for (type, content_details) in types.items():
        notion.pages.create(
            **{
                "parent": {
                    "database_id": "ce05cf613a7a42d29516ff3ca35ce2e7",
                },
                "properties": {
                    "Name": {
                        "title": [
                            {
                                "text": {
                                    "content": type
                                }
                            }
                        ]
                    },
                    "Category": {
                        "select": {
                            "name": category
                        }
                    },
                    "Names": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": ",".join(content_details['names'])
                                }
                            }
                        ]
                    },
                    "Icon": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": content_details['icon']
                                }
                            }
                        ]
                    }
                }
            }
        )
        print(type + " - " + category)
        sleep(0.5)

# Update content table in Notion
relations_name_to_id = {}
relations_id_to_name = {}

for type in type_result:
    relations_name_to_id[type['properties']['Name']
                         ['title'][0]['plain_text']] = type['id']
    relations_id_to_name[type['id']
                         ] = type['properties']['Name']['title'][0]['plain_text']

for (category, types) in config['contentTags'].items():
    for (type, content_details) in types.items():
        for description in content_details['description']:
            notion.pages.create(
                **{
                    "parent": {
                        "database_id": "7f68cff9ee9f4a09929cd5f2c92861b2"
                    },
                    "properties": {
                        "Summary": {
                            "title": [
                                {
                                    "text": {
                                        "content": ""
                                    }
                                }
                            ]
                        },
                        "Property Type": {
                            "select": {
                                "name": 'Description'
                            }
                        },
                        "Odds": {
                            "number": description['odds']
                        },
                        "Text": {
                            "rich_text": [
                                {
                                    "text": {
                                        "content": description['text']
                                    }
                                }
                            ]
                        },
                        "Hex content types": {
                            "relation": [
                                {
                                    "id": relations_name_to_id[type]
                                }
                            ]
                        }

                    }
                }
            )
            sleep(0.5)
        for hook in content_details['hook']:
            notion.pages.create(
                **{
                    "parent": {
                        "database_id": "7f68cff9ee9f4a09929cd5f2c92861b2"
                    },
                    "properties": {
                        "Summary": {
                            "title": [
                                {
                                    "text": {
                                        "content": ""
                                    }
                                }
                            ]
                        },
                        "Property Type": {
                            "select": {
                                "name": 'Hook'
                            }
                        },
                        "Odds": {
                            "number": hook['odds']
                        },
                        "Text": {
                            "rich_text": [
                                {
                                    "text": {
                                        "content": hook['text']
                                    }
                                }
                            ]
                        },
                        "Hex content types": {
                            "relation": [
                                {
                                    "id": relations_name_to_id[type]
                                }
                            ]
                        }

                    }
                }
            )
            sleep(0.5)
        print(type + " - " + category)

for (category, types) in config['contentTags'].items():
    for (type, content_details) in types.items():
        for k in content_details.keys():
            if k not in ['odds', 'names', 'icon', 'description', 'hook']:
                notion.pages.create(
                    **{
                        "parent": {
                            "database_id": "1e921bbc85e14ff9b432882cccce17e4",
                        },
                        "properties": {
                            "Name": {
                                "title": [
                                    {
                                        "text": {
                                            "content": k
                                        }
                                    }
                                ]
                            },
                            "Entries": {
                                "rich_text": [
                                    {
                                        "text": {
                                            "content": ",\n".join(content_details[k]),
                                        },
                                    },
                                ],
                            },
                            "Hex content types": {
                                "relation": [
                                    {"id": relations_name_to_id[type]}
                                ]
                            }
                        }
                    }
                )
                sleep(0.5)
        print(type + " - " + category)

for (list, entries) in config['globalFillLists'].items():
    notion.pages.create(
        **{
            "parent": {
                "database_id": "1e921bbc85e14ff9b432882cccce17e4",
            },
            "properties": {
                "Name": {
                    "title": [
                        {
                            "text": {
                                "content": list
                            }
                        }
                    ]
                },
                "Entries": {
                    "rich_text": [
                        {
                            "text": {
                                "content": ",\n".join(entries),
                            },
                        },
                    ],
                }
            }
        }
    )
    sleep(0.5)
