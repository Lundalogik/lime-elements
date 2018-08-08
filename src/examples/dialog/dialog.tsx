import { Component, State } from '@stencil/core';
import { LanguageService } from '../../components/language-selector/language.service';

@Component({
    shadow: true,
    tag: 'limel-example-dialog',
})
export class DialogExample {
    @State()
    public dialogOpen = false;
    @State()
    public isValid = false;

    @State()
    public age: number;
    @State()
    public name = '';

    private labelOpen: string;
    private languageService: LanguageService;

    public componentWillLoad() {
        this.languageService = new LanguageService();
        this.labelOpen = this.languageService.getTranslation(
            'limel.dialog.open'
        );
    }

    public render() {
        return [
            <limel-button
                primary={true}
                label={this.labelOpen}
                onClick={() => {
                    this.dialogOpen = true;
                }}
            />,

            <limel-dialog
                open={this.dialogOpen}
                onClose={() => {
                    this.dialogOpen = false;
                }}
            >
                <form>
                    <label>Name: </label>
                    <input
                        tabindex="0"
                        type="text"
                        value={this.name}
                        onInput={this.handleChangeName}
                    />
                    <br />
                    <label>Age: </label>
                    <input
                        type="text"
                        value={this.age}
                        onInput={this.handleChangeColor}
                    />
                </form>
                <limel-button-group reverse-order={true} slot="button">
                    <limel-button
                        primary={true}
                        label="Save"
                        disabled={!this.isValid}
                        onClick={this.submitForm}
                    />
                    <limel-button label="Cancel" onClick={this.closeDialog} />
                </limel-button-group>
            </limel-dialog>,
        ];
    }

    /**
     *
     */
    public handleChangeName = event => {
        this.name = event.target.value;
        this.validate();
    };

    /**
     *
     */
    public handleChangeColor = event => {
        this.age = event.target.value;
        this.validate();
    };

    /**
     *
     */
    public validate = () => {
        const MIN_NAME_LENGTH = 5;
        const MIN_AGE = 20;
        const MAX_AGE = 50;
        this.isValid =
            this.name.length >= MIN_NAME_LENGTH &&
            (this.age > MIN_AGE && this.age < MAX_AGE);
    };

    /**
     *
     */
    public submitForm = () => {
        alert(`${this.name} is ${this.age} years old`);
        this.closeDialog();
    };

    /**
     *
     */
    public closeDialog = () => {
        this.dialogOpen = false;
    };
}
