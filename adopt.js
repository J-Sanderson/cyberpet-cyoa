class Scene {
  constructor(params = {}) {
    [
      'name',
      'desc', 
      'nextScenes', 
      'pets', 
      'theme', 
      'stateDesc',
      'passwordPrompt'
    ].forEach(param => {
      this[param] = params[param];
    });
  }

  getActiveDesc(world) {
    if(!this.stateDesc) return { desc: this.desc, nextScenes: this.nextScenes };
    const match = this.stateDesc.find(state => {
      if (state.conditionsMode === 'all') {
        return state.conditions.every(flag => world.getFlag(flag));
      }
      if (state.conditionsMode === 'any') {
        return state.conditions.some(flag => world.getFlag(flag));
      }
      // default to 'all' if not specified
      return state.conditions.every(flag => world.getFlag(flag));
    });
    return match || { desc: this.desc, nextScenes: this.nextScenes };
  }

  outputDesc(world) {
    try {
      const active = this.getActiveDesc(world);
      world.getOutput().insertAdjacentHTML('beforeend', active.desc);
      const scenes = active.nextScenes || this.nextScenes;
      if (this.pets.length) {
        this.outputPet(world);
      }
      if (!scenes.length) {
        this.outputRestart(world);
      }
      // check for password prompt
      if(this.passwordPrompt) {
        this.outputPrompt(world, active);
      }
      scenes.forEach(function(nextScene) {
        world.getOutput().insertAdjacentHTML(
          'beforeend',
          `<button class="${nextScene.choices ? 'next-scene-rand' : 'next-scene'}" data-scene="${nextScene.name}">
            ${nextScene.text}
          </button>`
        );
      });
    } catch(err) {
      world.handleError(err);
    }
  }

  outputPet(world) {
    try {
      const rand = world.randRange(1, 100);
      const petName = this.pets.find(function(pet) {
        return rand <= pet.threshold;
      }).name;
      const pet = petList[petName];
      const img = world.randRange(1, pet.images.length) - 1;
      world.getOutput().insertAdjacentHTML(
        'beforeend',
        `<p><strong>You've found a creature: ${pet.name}</strong></p>
        <p>${pet.desc}</p>
        <img src="./img/${pet.images[img]}" alt="${pet.name} image">
        <p>To adopt this creature, right click and save to your hard drive. If you'd like to display it on your webpage, upload to your own hosting and link back to this page so others can go exploring too.</p>
    `);
    } catch(err) {
      world.handleError(err);
    }
  }

  outputRestart(world) {
    world.getOutput().insertAdjacentHTML('beforeend', `<button class="restart">Adventure again?</button>`);
  }

  outputPretext(world, name, choices, activeNextScenes) {
    try {
      const scenesToSearch = activeNextScenes || this.nextScenes;
      let preTextScene;
      if (choices) {
        preTextScene = scenesToSearch.find(function(scene) {
          return scene.name === choices;
        })?.choices.find(function(choice) {
          return choice.preText && choice.name === name;
        });
      } else {
        preTextScene = scenesToSearch.find(function(scene) {
          return scene.preText && scene.name === name;
        });
      }
      if (preTextScene) {
        world.getOutput().insertAdjacentHTML('beforeend', preTextScene.preText);
      }
    } catch(err) {
      world.handleError(err);
    }
  }

  outputPrompt(world) {
    try {
      const form = document.createElement('form');
      form.classList.add('password-form');
  
      const prompt = document.createElement('label');
      prompt.textContent = this.passwordPrompt.prompt;
      prompt.setAttribute('for', this.passwordPrompt.key);
      
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('name', this.passwordPrompt.key);
      
      const submit = document.createElement('button');
      submit.setAttribute('type', 'submit');
      submit.textContent = 'Try';

      form.append(prompt, input, submit);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        world.submitPassword(input, this.passwordPrompt);
      });
      
      world.getOutput().append(form);
    } catch(err) {
      world.handleError(err);
    }
  }

  changeTheme(world) {
    try {
      const body = world.getBody();
      body.setAttribute('class', '');
      if (this.theme) {
        body.classList.add(this.theme);
      }
    } catch(err) {
      world.handleError(err);
    }
  }
}

class World {
  constructor(body, output, scenes, petList, itemList) {
    this.body = body;
    this.output = output;
    this.scenes = {};
    this.petList = petList;
    this.itemList = itemList;
    this.flags = {};
    this.passwords = {};
    this.inventoryEl;

    scenes.forEach(scene => {
      this.scenes[scene.name] = new Scene(scene);
    });

    output.addEventListener('click', (e) => {
      this.clickNextScene(e);
    });

    const inventoryDialog = document.getElementById('inventory-dialog')
    const inventoryOpen = document.getElementById('open-inventory');
    const inventoryClose = document.getElementById('close-inventory');
    const inventoryEl = document.getElementById('inventory-items');
    if(inventoryDialog && inventoryOpen && inventoryClose && inventoryEl) {
      this.inventoryEl = inventoryEl;
      inventoryOpen.addEventListener('click', () => {
        this.renderInventory();
        inventoryDialog.showModal();
      });
      inventoryClose.addEventListener('click', () => {
        inventoryDialog.close();
        this.inventoryEl.innerHTML = '';
      });
    }

    this.getOutput().innerHTML = '';

    this.currentScene = 'open';
    this.scenes[this.currentScene].outputDesc(this);
  }

  clickNextScene(e) {
    const target = e.target || e.originalTarget;
    if(target.classList.contains('next-scene') && target.dataset.scene) {
      try {
        const next = this.scenes[target.dataset.scene];
        const current = this.scenes[this.currentScene];
        const active = current.getActiveDesc(this);
        const clickedScene = active.nextScenes.find(s => s.name === target.dataset.scene);
        if (clickedScene?.setFlags) {
          clickedScene.setFlags.forEach(flag => this.setFlag(flag));
        }
        if (clickedScene?.unsetFlags) {
          clickedScene.unsetFlags.forEach(flag => this.unsetFlag(flag));
        }
        if(clickedScene?.setPasswords) {
          clickedScene.setPasswords.forEach(password => this.setPassword(password));
        }
        this.disableButtons();
        this.changeScene(next);
      } catch(err) {
        this.handleError(e);
      }
    }

    if(target.classList.contains('next-scene-rand') && target.dataset.scene) {
      try {
        const current = this.scenes[this.currentScene];
        const active = current.getActiveDesc(this);
        const next = target.dataset.scene;
        const nextScenes = active.nextScenes.find(nextScene => {
          return nextScene.name === next;
        });
        const rand = this.randRange(1, 100);
        const scene = nextScenes.choices.find(choice => {
          return rand <= choice.threshold;
        });
        if (scene?.setFlags) {
          scene.setFlags.forEach(flag => this.setFlag(flag));
        }
        if (scene?.unsetFlags) {
          scene.unsetFlags.forEach(flag => this.unsetFlag(flag));
        }
        if(scene?.setPasswords) {
          clickedScene.setPasswords.forEach(password => this.setPassword(password));
        }
        this.disableButtons();
        this.changeScene(this.scenes[scene.name], next);
      } catch(err) {
        this.handleError(err);
      }
    }

    if(target.classList.contains('restart')) {
      try {
        this.getOutput().innerHTML = '';
        Object.keys(this.flags).forEach(key => {
          if (!this.flags[key].persistent) {
            delete this.flags[key];
          }
        });
        this.changeScene(this.scenes['open']);
      } catch(err) {
        this.handleError(err);
      }
    }
  }

  submitPassword(input, passwordPrompt) {
    try {
      const answer = this.passwords[passwordPrompt.key];
      this.disableButtons();
      if(input.value.trim().toLowerCase() === answer?.toLowerCase()) {
        this.changeScene(this.scenes[passwordPrompt.successScene]);
      } else {
        this.changeScene(this.scenes[passwordPrompt.failScene]);
      } 
    } catch(err) {
      this.handleError(err);
    }
  }

  disableButtons() {
    const buttons = this.output.querySelectorAll('.next-scene, .next-scene-rand');
    buttons.forEach(button => {
      if(!button.disabled) {
        button.disabled = true;
      }
    });
  }

  changeScene(scene, choices) {
    const current = this.scenes[this.currentScene];
    const active = current.getActiveDesc(this);
    this.scenes[this.currentScene].outputPretext(this, scene.name, choices, active.nextScenes);
    this.currentScene = scene.name;
    scene.outputDesc(this);
    scene.changeTheme(this);
  }

  handleError(err) {
    if(err) console.error(err);
    this.output.insertAdjacentHTML('beforeend', '<p>Something went wrong. Taking you back to the start...</p>');
    this.flags = {};
    this.changeScene(this.scenes['open']);
  }

  renderInventory() {
    const inventory = this.itemList.filter(item => this.flags.hasOwnProperty(item.flag));
    if(inventory.length) {
      let list = document.createElement('ul');
      let items = inventory.reduce((acc, item) => {
        return acc + `<li>${item.desc}</li>`;
      }, '');
      list.innerHTML = items;
      this.inventoryEl.append(list);
    } else {
      this.inventoryEl.innerHTML = '<p>You are not carrying anything.</p>'
    }
  }

  randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getBody() {
    return this.body;
  }

  getOutput() {
    return this.output;
  }

  setFlag(flag, persistent = false) {
    if (typeof flag === 'object') {
      this.flags[flag.key] = { value: true, persistent: flag.persistent ?? false };
    } else {
      this.flags[flag] = { value: true, persistent };
    }
  }

  unsetFlag(flag) {
    delete this.flags[flag];
  }

  getFlag(key) {
    return !!(this.flags[key]?.value);
  }

  setPassword(password) {
    this.passwords[password.key] = password.value;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const output = document.querySelector('#output');

  new World(body, output, sceneList, petList, itemList);

  window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
  });
});
