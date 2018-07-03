let selectorDisableButton;
let selectorToggleOptionsButton;
let selectorToggleOptions = false;
let selectorElement;

document.addEventListener('DOMContentLoaded', function(event) {
    setupSelector();
    setupTextField();
});

function setupSelector() {
    function toggleOptions() {
        selectorToggleOptions = !selectorToggleOptions;

        let options,
            label,
            value;
        if (selectorToggleOptions) {
            options = [{ text: '', value: '', disabled: true },
                       { text: 'Luke Skywalker', value: 'luke' },
                       { text: 'Han Solo', value: 'han' },
                       { text: 'Leia Organo', value: 'leia' }];
            label = 'Star Wars Favourite';
            value = 'leia';
        } else {
            options = [{ text: '', value: ''},
                       { text: 'Homer Simpson', value: 'homer' },
                       { text: 'Moe Szyslak', value: 'moe' },
                       { text: 'Ned Flanders', value: 'ned' }];
            label = 'Simpsons Favourite';
            value = 'moe';
        }

        selectorElement.label = label;
        selectorElement.options = options;
        selectorElement.value = value;
    }

    selectorDisableButton = document.getElementById('selector-disable');
    selectorDisableButton.addEventListener('click', function(event) {
        selectorElement.disabled = !selectorElement.disabled;
        selectorDisableButton.innerHTML = selectorElement.disabled ? 'Enable' : 'Disable';
    });

    selectorToggleOptionsButton = document.getElementById('selector-toggle-options');
    selectorToggleOptionsButton.addEventListener('click', toggleOptions);

    selectorElement = document.getElementsByName('selector')[0];

    toggleOptions();
}

window.selectOnChange = function(e) {
    console.log('select value changed:', e.detail);
}

window.switchOnChange = function(e) {
    console.log(e.detail);
};

window.buttonOnClick = function(e) {
    console.log(e);
};
