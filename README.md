## About

A cyberpet in 90s/00s website circles is a small graphic of a creature that you can "adopt" by displaying on your own site. There were many different types of cyberpet agency, ranging from sites where you had to write an application to receive a pet, to sites where the pets were available for anyone to save and upload. Most of these agencies had a roleplay/choose your own adventure element, giving the impression that you were visiting the world of these creatures to find them. This particular demo is inspired by the [Nameless Forest](https://web.archive.org/web/20190118175640/https://namelessforest.com/), a massive CYOA webmaze.

Really this is just a text adventure, so you could use the engine for any kind of similar collectable game. There's functionality here for event flags, random chance paths, and password inputs. Please feel free to steal, modify, and improve as you like.

Images used are from [Lorem Picsum](https://picsum.photos/). This is just a demo; no need for actual creature images.

---
## Files

### adopt.js

This is your core engine. You shouldn't need to change anything here if you're just making new scenes.

### scenes.js

Where your scene, pet, and item lists live. This is the part you'll want to edit the most if you're making your own game. You'll probably want to run your live version through an obfuscator if you're making something for other people to play, but I've left this demo version readable so you can see how it all works.

### index.html / style.css

Self explanatory, you might need to edit these if you're adding new themes.

---

## Scenes

These are the core of your game and live in the sceneList array inside `scenes.js`. Each scene is an object that gets fed into the Scene class. An example of minimum scene object is as follows:

```
{
  "name": "sceneName", // must be unique
  "desc": "<p>Description of the scene.</p>",
  "nextScenes": [],
  "pets": [],
  "theme": null,
}
```

You must have at least one scene with a name of `open`. This will be your entry scene.

### Changing scenes

`nextScenes` is an array that contains a list of scenes that the user can proceed to. If it is empty then the engine will interpret the current scene as a game over and output an 'Adventure again?' button allowing the player to restart. Otherwise it will output a set of buttons showing each option the player can take. Example:

```
"nextScenes": [
  {
    "name", "door", // corresponds to the name property of the next scene object
    "text": "Go through the door",
  },
  {
    "name": "path",
    "text": "Follow the path",
  },
],
```

The player will be presented with two buttons labelled "Go through the door", and "Follow the path".

You can add an optional `preText` property to the next scene object. This outputs a transitional message before moving onto the next scene. For example:

```
{
  "name": "door",
  "text", "Go through the door",
  "preText": "<p>You walk through the door.</p>"
}
```

This will display a paragraph reading "You walk through the door" before the `door` scene outputs its description. This can be useful for scenarios in which you access one scene via multiple methods .

#### Random scenes

Sometimes you might want a scene transition to have a random outcome. For example, a player could look for a hidden area but only have a certain chance of finding it. To do this you can add a `choices` array onto a next scene object:

```
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
	  },
	],
  },
],
```

When the game engine sees this array it rolls a random number between 1 and 100. If the number is below the threshold for the lowest one in the array, it loads in the scene for that threshold. So here, a roll of 40 will take the player to `forestLookAroundNothing`, while a roll of 70 will take the player to 'forestLookAroundPath'. You can have as many choices as you want, but they should be ordered by threshold and the final choice must have a threshold of 100.

In this example you have a 50/50 chance of finding the hidden path, but you can change the odds for a common or rare outcome. For example here the hidden path only has a 10% chance of being found:

```
"choices": [
  {
	"name": "forestLookAroundNothing",
	"preText": "<p>You look around in search of the noise",
	"threshold": 90,
  },
  {
	"name": "forestLookAroundPath",
	"preText": "<p>You look around in search of the noise",
	"threshold": 100,
  },
],
```

Note also that `preText` can be used here, too. It's optional, and the message can be different for each outcome.

#### Flags

Flags can be used to mark that a player has taken a specific action that affects the game world. An obvious example would be taking an item. Flags are set on scene change using the `setFlags` array. For example:

```
 {
   "name": "table",
   "desc": "<p>You are looking at a large wooden table. On the table is a key.</p>",
   "nextScenes": [
      {
        "name": "keyTake",
        "text": "Take the key",
        "preText": "<p>You pick up the key.</p>",
        "setFlags": ["keyFound"],
      },
      {
        "name": "keyLeave",
        "text": "Leave it",
        "preText": "<p>You decide to leave the key where it is.</p>"
      },
   ],
   "pets": [],
 }
```

Here choosing to take the key will set a `keyFound` flag in the game world, while leaving it will do nothing. We can then use the flag to affect the game world later (see States, below).

Note that the flag is set on selecting the "Pick up the key" option, so will become valid when the next scene, `keyTake`, loads.

Since `setFlags` is an array you can of course pass more than one flag in at a time if you want:

```
setFlags: ["keyFound", "trapSet"]
```
##### Persistent flags

Flags are usually wiped on game over/restart. However you can set a flag to be persistent so that it remains in place when the player clicks "Adventure again?" To do this we pass in a key object rather than a string, with a `persistent` property:

```
setFlags: [{key: "bookRead", persistent: true}]
```

(You can of course also create regular flags using `persistent: false`, but that's kind of pointless...)

Note: there's no save function in the game, so everything is wiped if you leave the page regardless of this flag. Persistence just means the flag is saved on restarting after a game over screen.

##### Unsetting flags

You can also unset flags if you need to. This might happen if the player has used up an item so it should no longer be available. To do this, use the `unsetFlags` array:

```
nextScenes: [
  {
    "name": "doorUnlock",
    "text": "Unlock the door",
    "preText": "<p>You unlock the door with the key you were carrying</p>",
    "unsetFlags": ["keyFound"],
  }
],
```

You can also set and unset different flags at the same time, useful in this particular scenario:

```
nextScenes: [
  {
    "name": "doorUnlock",
    "text": "Unlock the door",
    "preText": "<p>You unlock the door with the key you were carrying</p>",
    "setFlags": ["doorOpened],
    "unsetFlags": ["keyFound"],
  }
],
```
#### States

States are used in combination with flags to alter the output of scenes when something has changed. For example if the player has moved an object or taken an item, you don't want that item to reappear in its original place. To do this we can create an alternate description using `stateDesc`. This is an array of objects, each one containing an alternate version of the scene.

```
 {
   "name": "table",
   "desc": "<p>You are looking at a large wooden table. On the table is a key.</p>",
   "nextScenes": [
      {
        "name": "keyTake",
        "text": "Take the key",
        "preText": "<p>You pick up the key.</p>",
        "setFlags": ["keyFound"],
      },
      {
        "name": "keyLeave",
        "text": "Leave it",
        "preText": "<p>You decide to leave the key where it is.</p>"
      },
   ],
   "stateDesc": [
     {
       "conditions": ["keyLeave"],
       "desc": "<p>There is nothing else left on the table.</p>",
       "nextScenes": [
         {
          "name": "room",
          "text": "Look around the room",
          "preText": "You step away from the table."
         },
       ],
     }
   ]
   "pets": [],
 }
```

The object must at minimum contain:

* `conditions`: an array of flags that must be set for the alternate description to display. There can be multiple flags if multiple conditions need to be satisfied.
* `desc`: the description for the alternate scene.

`nextScenes` is not mandatory but useful for showing different routes. If not set, the alternate scene will show the `nextScenes` for the base scene.

It is possible to have more than one object inside `stateDesc` for more complicated scenes:

```
{
  "name": "door",
  "desc": "<p>The door is locked.</p>",
  "nextScenes": [
    //
  ],
  "stateDesc": [
    {
      "conditions": "doorOpened",
      "desc": "<p>The door is open.</p>",
      "nextScenes": [
        //
      ],
    },
    {
      "conditions": "keyFound",
      "desc": "<p>The door is locked, but maybe the key you found will open it.</p>",
      "nextScenes": [
        //
      ],
    }
  ],
  "pets": [],
}
```

If two `stateDesc` objects share the same conditions, then the first one in the array order will display.

Note that `stateDesc` cannot be used to influence theme, or the pets that display in a scene - it just affects the `desc` and `nextScenes` properties. If you want to offer alternate pets/scenes, use it on a scene that then points to another scene(s) with different properties.

##### Conditions mode

If there are multiple flags inside the conditions array, the alternate state will only display if all are satisfied (AND). For example:

```
"stateDesc": [
  {
    "conditions": ["doorChecked", "tableChecked", "windowChecked"],
    "desc": "<p>You have fully explored the room.</p>"
  },
],
```

You can use the optional `conditionsMode` property to denote that the state should display if only some of the conditions are true (OR):

```
"stateDesc": [
  {
    "conditions": ["doorChecked", "tableChecked", "windowChecked"],
    "desc": "<p>You have fully explored the room.</p>"
  },
  {
    "conditions": ["doorChecked", "tableChecked", "windowChecked"],
    "conditionsMode": "any",
    "desc": "<p>You have partially explored the room.</p>"
  },
],
```

`conditionsMode` accepts the following strings:

* 'all' - default AND setting. This can be safely left off.
* 'any' - OR setting.

#### Passwords

You can set a scene to output a password prompt. This is a two part process. First, set the password itself. As with flags, this is done on scene transition with the `setPasswords` array:

```
  nextScenes: [
    "name": "room",
    "text": "Enter the room",
    "preText": "You head inside the room",
    "setPasswords": [{"key": "safeCombination", "value": "1234"}],
  ]
```

A password can be anything you like as long as it is a string, and is not case sensitive. This demo uses static passwords but you could just as easily generate more randomised ones with a function. As with flags it is possible to set multiple passwords by using more than one password object in the array.

You can set passwords on any scene transition you like but make sure it is set before the user encounters the point where they will have to enter it.

Once set you can then prompt the user for the password. This is done by adding the `passwordPrompt` object to the scene. This takes the password's key, some prompt text to label the input, and scene names for successful and failed inputs to display after submission:

```
{
  "name": "safe",
  "desc": "<p>You see a safe on the table. It is locked with a four digit combination lock.</p>",
  "nextScenes": [
    "name": "room",
    "text": "Look around the room",
  ],
  "passwordPrompt": {
    "prompt": "Tey a combination",
    "key": "safeCombination",
    "successScene": "safeSuccess",
    "failScene": "safeFail",
  },
  "pets": [],
}
```

Imputting the correct password that we set earlier in `setPasswords` will output the scene `safeSuccess`, while inputting the wrong one outputs `safeFail`. Note that you must still specify the `nextScenes`, else the user will get the "Adventure again?" ending option.

Password prompts cannot be conditionally output via `stateDesc`. If you need a scene to output the prompt or not depending on whether a flag is set, use `stateDesc` to route to the scene with the prompt.

#### Themes

Themes are optional but can give some visual flavour to the game by altering the colour scheme and background image to match the current scene.

```
{
  "name": "mountain",
  "desc": "<p>You are standing on top of a snowy mountain peak.</p>",
  "nextScenes": [
    //
  ],
  "pets": [],
  "theme": "mountain",
}
```

The game stylesheet and HTML document has the following themes defined:

* `forest`
* `cabin`
* `urban`
* `beach`
* `cliffs`
* `lake`
* `haunt`
* `mountain`

Theme classes are applied to the body element. If no theme is defined for a scene, or the theme is set to null, the default basic green theme will display (using the --theme-none variables in the stylesheet).

You can of course create new themes. To do this you will need to edit the `style.css` and `index.html` files.

---
## Pets

Pets are first defined in the `petList` object inside `scenes.js`. Each pet is an object with a name, description, and array of image filenames:

```
  const petList = {
    "dog": {
      "name": "Dog",
      "desc": "A dog",
      "images": [
        "dog.jpg",
      ],
    },
  },
```

Note that the images should be placed inside the /img directory as the game engine will render the image tag path using it.

The images array should contain at least one image, but can have more. If this is the case, then the game engine will randomly choose one to display. This can be useful for a pet that can come in different variations:

```
"dragon": {
  "name": "Dragon",
  "desc": "A dragon",
  "images": [
    "dragonRed.jpg",
    "dragonGreen.jpg",
  ],
},
```

In this situation if the user encounters the dragon pet they will have a 50/50 chance of it being the red or green version.

#### Outputting pets

The `pets` array inside a scene accepts any number of objects with a `name` and `threshold` property.

```
  "pets": [{"name": "dog", "threshold": 100}]
```

`name` is the key of the pet in the `petList` object. `threshold` works the same way as the same property on random choice scenes - if the pets array is populated, the game engine rolls a number between 1 and 100 and outputs the first pet with a threshold below the roll. If you only have one pet per scene, then it must have a threshold value of 100. For multiple pets, list them in order of threshold:

```
"pets": [
  {"name": "dragon", "threshold": 50},
  {"name": "dog", "threshold": 100}
]
```

Here the user has a 50/50 chance of encountering a dog or a dragon. You could use the threshold values to create more common or rare encounters. For example if you want the dragon to be rarer:

```
"pets": [
  {"name": "dragon", "threshold": 10},
  {"name": "dog", "threshold": 100}
]
```

----
## Items

Items are relatively basic - you either have an item, or you don't. They're based upon the flags system. Items are set in the `itemList` array and take a `flag` and `desc` property:

```
const itemList = [
  {
    "flag": "keyFound",
    "desc": "A small key",
  }
];
```

If the `keyFound` flag is set, then the item description will appear in the inventory dialog.

The item listing is basically a way for the player to keep track of what they're carrying rather than any sort of comprehensive inventory system. Effectively its just a list of things that appear if a given flag is set.