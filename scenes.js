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
  // Cabin - flags, inventory, state
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
      },
      {
        "name": "buildingDoor",
        "text": "Carry on",
        "preText": "<p>You carry on down the main path</p>",
      },
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
          },
          {
            "name": "buildingDoor",
            "text": "Carry on",
            "preText": "<p>You carry on down the main path</p>",
          },
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
      },
      {
        "name": "buildingDoor",
        "text": "Carry on",
        "preText": "<p>You carry on down the main path</p>",
      },
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
      },
      {
        "name": "buildingDoor",
        "text": "Carry on",
        "preText": "<p>You carry on down the main path</p>",
      },
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
  },
  // Building - passwords
  {
    "name": "buildingDoor",
    "desc": "<p>You are standing in front of a large building. The door is unlocked.</p>",
    "nextScenes": [
      {
        "name": "forest",
        "text": "Go back",
        "preText": "<p>You head up the main path into the forest</p>",
      },
      {
        "name": "building",
        "text": "Go inside",
        "preText": "<p>You head inside the building</p>",
        "setPasswords": [{"key": "buildingPassword", "value": "1234"}],
      }
    ],
    "pets": [],
    "theme": "forest",
  },
  {
    "name": "building",
    "desc": "<p>You are standing inside a large building. The door you entered by is open. There is another door at the other end, and a desk nearby.</p>",
    "nextScenes": [
      {
        "name": "buildingDoor",
        "text": "Leave",
        "preText": "<p>You head back outside</p>",
      },
      {
        "name": "buildingDesk",
        "text": "Look at the desk",
        "preText": "<p>You look closer at the desk.</p>",
      },
      {
        "name": "buildingLock",
        "text": "Check the door",
        "preText": "<p>You look closer at the far door.</p>"
      }
    ],
    "pets": [],
    "theme": "urban",
  },
  {
    "name": "buildingDesk",
    "desc": "<p>You see a piece of paper with '1234' written on it.</p>",
    "nextScenes": [
      {
        "name": "buildingDoor",
        "text": "Leave",
        "preText": "<p>You head back outside</p>",
      },
      {
        "name": "buildingLock",
        "text": "Check the door",
        "preText": "<p>You look closer at the far door.</p>"
      }
    ],
    "pets": [],
    "theme": "urban",
  },
  {
    "name": "buildingLock",
    "desc": "<p>The door is locked with a combination lock.</p>",
    "nextScenes": [
      {
        "name": "buildingDesk",
        "text": "Look at the desk",
        "preText": "<p>You look closer at the desk.</p>",
      },
      {
        "name": "buildingDoor",
        "text": "Leave",
        "preText": "<p>You head back outside</p>",
      },
    ],
    "passwordPrompt": {
      "prompt": "Try a code:",
      "key": "buildingPassword",
      "successScene": "buildingLockSuccess",
      "failScene": "buildingLockFail",
    },
    "pets": [],
    "theme": "urban",
  },
  {
    "name": "buildingLockFail",
    "desc": "<p>The lock doesn't move.</p>",
    "nextScenes": [
      {
        "name": "buildingDesk",
        "text": "Look at the desk",
        "preText": "<p>You look closer at the desk.</p>",
      },
      {
        "name": "buildingDoor",
        "text": "Leave",
        "preText": "<p>You head back outside</p>",
      },
    ],
    "pets": [],
    "theme": "urban",
  },
 {
    "name": "buildingLockSuccess",
    "desc": "<p>The lock clicks open.</p>",
    "nextScenes": [
      {
        "name": "beach",
        "text": "Go through the door",
        "preText": "<p>You head through the door.</p>",
      },
    ],
    "pets": [],
    "theme": "urban",
  },
  {
    "name": "beach",
    "desc": "<p>You are standing on a lovely beach. That's it for this demo!</p>",
    "nextScenes": [],
    "pets": [{"name": "walrus", "threshold": 100}],
    "theme": "beach",
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
  "walrus": {
    "name": "Walrus",
    "desc": "You're going to need a bigger fishtank.",
    "images": [
      "walrus.jpg",
    ],
  },
};

const itemList = [
  {
    "flag": "cabinKeyFound",
    "desc": "A small key",
  }
];
