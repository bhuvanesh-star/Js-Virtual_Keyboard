//make the keyboard work
// generate html 


//requirments to make the keyboard work
const keyboard = {
    //new obj containing 3 properties
    elements: {
        main: null, //main-container(keyboard)
        keysContainer: null, //keys-container(keyboard-keys)
        keys: [] //button for the keys
    },

    eventHandelers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false
    },

    init() {
        //create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        //create main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard-keys");
        this.elements.keysContainer.appendChild(this._createKeys());


        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard-key");

        //Add To DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        //automatically use keyboard for elements with use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus",()=>{
                this.open(element.value, currentValue => {
                    element.value = currentValue
                })
            })
        })
    },

    _createKeys() {
        //creates all thy html elements for us 
        // largest method in this document
        // Fragment is a little container to all the Elements
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];

        //function creating icons
        const CreateIcon = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        //looping b/n each characters to generate html
        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const lineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

            //Add attributes 
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard-key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard-key-wide");
                    keyElement.innerHTML = CreateIcon("backspace")
                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvents("oninput");
                    });

                    break;
                case "caps":
                    keyElement.classList.add("keyboard-key-wide", "keyboard-key-activatable");
                    keyElement.innerHTML = CreateIcon("keyboard_capslock")
                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard-key-active", this.properties.capsLock);
                    });

                    break;
                case "enter":
                    keyElement.classList.add("keyboard-key-wide");
                    keyElement.innerHTML = CreateIcon("keyboard_return")
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvents("oninput");
                    });

                    break;
                case "space":
                    keyElement.classList.add("keyboard-key-extra-wide");
                    keyElement.innerHTML = CreateIcon("space_bar")
                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvents("oninput");
                    });

                    break;

                case "done":
                    keyElement.classList.add("keyboard-key-wide", "keyboard-key-dark");
                    keyElement.innerHTML = CreateIcon("check_circle")
                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvents("onclose");
                    });

                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvents("oninput");
                    });

                    break;

            }


            fragment.appendChild(keyElement);

            if (lineBreak){
                fragment.appendChild(document.createElement("br"));
            }
        })
        return fragment;
    },

    _triggerEvents(handlername) {
        //triggers the respective events
        //if a function is specifiedthen fire it 
        if (typeof this.eventHandelers[handlername] == "function") {
            this.eventHandelers[handlername](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;


        for (const key of this.elements.keys){
            if (key.childElementCount === 0){
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase() 
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || '';
        this.eventHandelers.oninput = oninput;
        this.eventHandelers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden")
    },

    close() {
        this.properties.value = "";
        this.eventHandelers.oninput = oninput;
        this.eventHandelers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden")
    }
}

window.addEventListener("DOMContentLoaded", function () {
    //when loded starts up init function
    keyboard.init()
})