const sceneList = [
  {
    "name": "open",
    "desc": "<p>You are standing in a field. There is a cabin to your left. A path ahead leads into a thick forest.</p>",
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
      {
        "name": "forest",
        "text": "Follow the path",
        "preText": "<p>You follow the path, and the trees begin to close in around you.</p>",
      },
    ],
    "pets": [],
    "theme": null,
  },
  // Cabin - flags + state
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
        "conditions": ["cabinDoorOpened"],
        "desc": "<p>The door is open. You can go straight inside</p>",
        "nextScenes": [
          {
            "name": "cabin",
            "text": "Go inside",
            "preText": "<p>You go inside the cabin.</p>"
          },
        ],
      },
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
            "setFlags": ["cabinDoorOpened"],
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
  // Forest - random events
  {
    "name": "forest",
    "desc": "<p>You are standing in the middle of the forest. In the distance you hear a rustling noise.</p>",
    "nextScenes": [
      {
        "name": "forestLookAround",
        "text": "Look around",
        "choices": [
          {
            "name": "forestLookAroundNothing",
            "preText": "<p>You look around in search of the noise",
            "threshold": 50,
          },
          {
            "name": "forestLookAroundPath",
            "preText": "<p>You look around in search of the noise",
            "threshold": 100,
            "setFlags": ["forestPathFound"],
          },
        ],
      },
      {
        "name": "open",
        "text": "Go back",
        "preText": "<p>You walk back up the path toward the cabin.</p>",
      }
    ],
    "stateDesc": [
      {
        "conditions": ["forestPathFound"],
        "desc": "<p>You are standing in the middle of the forest. You can see the little hidden path you found earlier heading into the undergrowth.</p>",
        "nextScenes": [
          {
            "name": "forestClearing",
            "text": "Follow the hidden path",
            "preText": "<p>The path is very narrow, but you manage to squeeze your way through the undergrowth until it opens out.</p>",
          },
          {
            "name": "open",
            "text": "Go back",
            "preText": "<p>You walk back up the path toward the cabin.</p>",
          }
        ],
      }
    ],
    "pets": [],
    "theme": "forest",
  },
  {
    "name": "forestLookAroundNothing",
    "desc": "<p>You don't see anything out of the ordinary. The noise seems to have stopped.</p>",
    "nextScenes": [
      {
        "name": "open",
        "text": "Go back",
        "preText": "<p>You walk back up the path toward the cabin.</p>",
      }
    ],
    "pets": [],
    "theme": "forest",
  },
  {
    "name": "forestLookAroundPath",
    "desc": "<p>You spot a tiny hidden path running deeper into the forest, toward the source of the noise.</p>",
    "nextScenes": [
      {
        "name": "forestClearing",
        "text": "Follow the hidden path",
        "preText": "<p>The path is very narrow, but you manage to squeeze your way through the undergrowth until it opens out.</p>",
      },
      {
        "name": "open",
        "text": "Go back",
        "preText": "<p>You walk back up the path toward the cabin.</p>",
      }
    ],
    "pets": [],
    "theme": "forest",
  },
  {
    "name": "forestClearing",
    "desc": "<p>You are standing inside a forest clearing. The rustling seems to be closer now.</p>",
    "nextScenes": [
      {
        "name": "forestEncounter",
        "text": "Watch and wait",
        "preText": "<p>You stay very still, not wanting to startle what's there.</p>",
        "setFlags": ["forestClearingEncountered"],
      },
      {
        "name": "forest",
        "text": "Go back",
        "preText": "<p>You're not sure it's safe to stay around, so you head back to the main path.</p>",
      }
    ],
    "stateDesc": [
      {
        "conditions": ["forestClearingEncountered"],
        "desc": "<p>You are standing inside a forest clearing. It is very quiet now. There doesn't seem to be anything here.</p>",
        "nextScenes": [
          {
            "name": "forest",
            "text": "Go back",
            "preText": "<p>You head back to the main path.</p>"
          },
        ],
      }
    ],
    "pets": [],
    "theme": "forest",
  },
  {
    "name": "forestEncounter",
    "desc": "<p>As you wait, something steps out into the clearing. It looks like it wants to come along with you.</p>",
    "pets": [
      {"name": "bear", "threshold": 50},
      {"name": "wolf", "threshold": 100}
    ],
    "nextScenes": [
      {
        "name": "forest",
        "text": "Continue",
        "preText": "<p>You head back to the main path.</p>"
      },
    ],
    "theme": "forest",
  }
];

const petList = {
  "dog": {
    "name": "Dog",
    "desc": "It's a dog!",
    "images": [
      "dog.jpg"
    ],
  },
  "wolf": {
    "name": "Wolf",
    "desc": "A wolf! Better hope it's friendly.",
    "images": [
      "wolf.jpg",
    ],
  },
  "bear": {
    "name": "Bear",
    "desc": "A bear! Better hope it's friendly.",
    "images": [
      "bear.jpg",
    ],
  },
};

const itemList = [
  {
    "flag": "cabinKeyFound",
    "desc": "A small key",
  }
];
