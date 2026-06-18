const sceneList = [
  {
    "name": "open",
    "desc": "<p>You are standing in a field. There is a cabin to your left.</p>",
    "nextScenes": [
      {
        "name": "cabinDoor",
        "text": "Open the cabin door",
        "preText": "<p>You try to open the cabin door.</p>",
      },
      {
        "name": "cabinMat",
        "text": "Look at the cabin doormat",
        "preText": "<p>You crouch down to look closer at the cabin's doormat.</p>",
      },
    ],
    "pets": [],
    "theme": null,
  },
  {
    "name": "cabinDoor",
    "desc": "<p>The door is locked.</p>",
    "nextScenes": [
      {
        "name": "open",
        "text": "Look around",
      }
    ],
    "stateDesc": [
      {
        "conditions": ["cabinKeyFound"],
        "desc": "<p>The door is locked, but maybe the key you found will open it?</p>",
        "nextScenes": [
          {
            "name": "open",
            "text": "Look around",
          },
          {
            "name": "cabin",
            "text": "Open the door",
            "preText": "<p>You try the key. It unlocks the door and you step inside.</p>",
            "unsetFlags": ["cabinKeyFound"],
          }
        ],
      }
    ],
    "pets": [],
    "theme": null,
  },
  {
    "name": "cabinMat",
    "desc": "<p>You notice something underneath the mat and pull it out. It's a small key.</p>",
    "nextScenes": [
      {
        "name": "open",
        "text": "Look around",
        "setFlags": ["cabinKeyFound"],
      }
    ],
    "stateDesc": [
      {
        "conditions": ["cabinKeyFound"],
        "desc": "<p>There's nothing else of interest here.</p>",
        "nextScenes": [
          {
            "name": "open",
            "text": "Look around",
          }
        ],
      },
    ],
    "pets": [],
    "theme": null,
  },
  {
    "name": "cabin",
    "desc": "<p>You are standing inside a cabin. There is a big couch against one wall.</p>",
    "nextScenes": [
      {
        "name": "cabinCouch",
        "text": "Look behind the couch",
        "preText": "<p>You look behind the couch.</p>"
      },
      {
        "name": "open",
        "text": "Go outside",
        "preText": "<p>You head back outside.</p>"
      }
    ],
    "stateDesc": [
      {
        "conditions": ["dogEncountered"],
        "desc": "<p>You are standing inside a cabin. There is a big couch against one wall, but there is nothing else behind it.</p>",
        "nextScenes": [
          {
            "name": "open",
            "text": "Go outside",
            "preText": "<p>You head back outside.</p>"
          }
        ],
      }
    ],
    "pets": [],
    "theme": "cabin",
  },
  {
    "name": "cabinCouch",
    "desc": "<p>There is a dog behind the couch. It seems very friendly, looks like it wants to come along with you!</p>",
    "nextScenes": [
      {
        "name": "cabin",
        "text": "Look around",
        "setFlags": ["dogEncountered"],
      }
    ],
    "pets": [{"name": "dog", "threshold": 100}],
    "theme": "cabin",
  },
];

const petList = {
  "dog": {
    "name": "Dog",
    "desc": "It's a dog!",
    "images": [
      "dog.jpg"
    ],
  },
};

const itemList = [
  {
    "flag": "cabinKeyFound",
    "desc": "A small key",
  }
];
