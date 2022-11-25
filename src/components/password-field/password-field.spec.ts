import { PasswordField } from './password-field';

describe('Unit test Password-fiield', () => {
    let component = new PasswordField();

    describe('Test function: checkPasswordParams', () => {
        beforeEach(() => {
            component = new PasswordField();
        })
        
        it('Test min length password', () => {
            let goodPassword = "1234567";
            let badPassword = "123";

            component.passwordParameters = {
                minLength: 5,
            }

            component.checkPasswordParams(goodPassword);

            expect(component.passwordParameters).toBeTruthy();
            expect(component.minlengthCheck).toBeTruthy();

            component.checkPasswordParams(badPassword);

            expect(component.passwordParameters).toBeTruthy();
            expect(component.minlengthCheck).not.toBeTruthy();

        });

        it('Test max length password', () => {
            let goodPassword = "1234567";
            let badPassword = "123456789";

            component.passwordParameters = {
                maxLength: 8
            }

            component.checkPasswordParams(goodPassword);

            expect(component.passwordParameters).toBeTruthy();
            expect(component.maxlengthCheck).toBeTruthy();

            component.checkPasswordParams(badPassword);

            expect(component.passwordParameters).toBeTruthy();
            expect(component.maxlengthCheck).not.toBeTruthy();

        });

        it('Test consist lower case character password', () => {
            let goodPassword = "PAsSWORD";
            let badPassword = "PASSWORD";

            component.passwordParameters = {
                mustConsistLowerCaseLetters: true,
            }

            component.checkPasswordParams(goodPassword);

            expect(component.passwordParameters).toBeTruthy();
            expect(component.hasLowerCase).toBeTruthy();

            component.checkPasswordParams(badPassword);

            expect(component.passwordParameters).toBeTruthy();
            expect(component.hasLowerCase).not.toBeTruthy();

        });

        it('Test consist upper case character password', () => {
            let goodPassword = "pasSword";
            let badPassword = "password";

            component.passwordParameters = {
                mustConsistCapitalLetters: true,
            }

            component.checkPasswordParams(goodPassword);

            expect(component.passwordParameters).toBeTruthy();
            expect(component.hasCapitalCase).toBeTruthy();

            component.checkPasswordParams(badPassword);

            expect(component.passwordParameters).toBeTruthy();
            expect(component.hasCapitalCase).not.toBeTruthy();

        });

        it('Test consist numeric character password', () => {
            let goodPassword = "pasSword1";
            let badPassword = "password";

            component.passwordParameters = {
                mustConsistNumericCharacter: true,
            }

            component.checkPasswordParams(goodPassword);

            expect(component.passwordParameters).toBeTruthy();
            expect(component.hasNumeric).toBeTruthy();

            component.checkPasswordParams(badPassword);

            expect(component.passwordParameters).toBeTruthy();
            expect(component.hasNumeric).not.toBeTruthy();

        });

        it('Test consist special character password', () => {
            let goodPassword = "pasSword1#!";
            let badPassword = "PAssWord6";

            component.passwordParameters = {
                mustConsistNumericCharacter: true,
            }

            component.checkPasswordParams(goodPassword);

            expect(component.passwordParameters).toBeTruthy();
            expect(component.hasSpecial).toBeTruthy();

            component.checkPasswordParams(badPassword);

            expect(component.passwordParameters).toBeTruthy();
            expect(component.hasSpecial).not.toBeTruthy();

        });

        it('Test max length password', () => {
            let goodPassword = "pasSword1#!";
            let badPassword = "PAsWr6";

            component.passwordParameters = {
                maxLength: 16,
                minLength: 8,
                mustConsistCapitalLetters: true,
                mustConsistLowerCaseLetters: true,
                mustConsistNumericCharacter: true,
                mustConsistSpecialChracters: true,
            }

            component.checkPasswordParams(goodPassword);

            expect(component.maxlengthCheck).toBeTruthy();
            expect(component.minlengthCheck).toBeTruthy();
            expect(component.hasCapitalCase).toBeTruthy();
            expect(component.hasLowerCase).toBeTruthy();
            expect(component.hasSpecial).toBeTruthy();
            expect(component.hasNumeric).toBeTruthy();

            component.checkPasswordParams(badPassword);

            expect(component.maxlengthCheck).toBeTruthy();
            expect(component.minlengthCheck).not.toBeTruthy();
            expect(component.hasCapitalCase).toBeTruthy();
            expect(component.hasLowerCase).toBeTruthy();
            expect(component.hasSpecial).not.toBeTruthy();
            expect(component.hasNumeric).toBeTruthy();
        });
    });

    describe('Test function: isInvalid', () => {
        beforeEach(() => {
            component = new PasswordField();
        });

        it('Test invalid prop', () => {
            component.invalid = true;
            expect(component.isInvalid()).toBeTruthy();
            component.invalid = false;
            expect(component.isInvalid()).not.toBeTruthy();
        });

        it('Test isModified state', () => {
            component.isModified = true;
            expect(component.isInvalid()).not.toBeTruthy();
            component.isModified = false;
            expect(component.isInvalid()).not.toBeTruthy();
        });

        it('Test password parameters', () => {
            component.isModified = true;

            // STUB test
            component.checkPasswordParamsControls = (): boolean => {
                return true;
            };

            expect(component.isInvalid()).not.toBeTruthy();
            component.passwordParameters = {
                maxLength: 10,
            }
            expect(component.isInvalid()).toBeTruthy();

            component.checkPasswordParamsControls = (): boolean => {
                return false;
            };

            component.passwordParameters = undefined;
            expect(component.isInvalid()).not.toBeTruthy();
            component.passwordParameters = {
                maxLength: 10,
            }
            expect(component.isInvalid()).not.toBeTruthy();
        });

        it('Test value', () => {
            component.isModified = true;
            component.required = true;
            component.value = "Password";

            expect(component.isInvalid()).not.toBeTruthy();

            component.value = "";
            expect(component.isInvalid()).toBeTruthy();
        });
    });

    describe('Test render password Parameters', () => {
        beforeEach(() => {
            component = new PasswordField();
        });

        it('Test render lover case checkbox', () => {
            component.passwordParameters = {
                mustConsistLowerCaseLetters: false,
            };
            expect(component.renderLoverCaseCheckbox()).toBeUndefined();

            component.passwordParameters = {
                mustConsistLowerCaseLetters: true,
            };
            expect(component.renderLoverCaseCheckbox()).toMatchObject(
                {"$attrs$": {"checked": false, "id": "terms", "label": "Lowercase letters", "readonly": true}, "$children$": null, "$elm$": null, "$flags$": 0, "$key$": null, "$name$": null, "$tag$": "limel-checkbox", "$text$": null}
            );
        });

        it('Test render upper case checkbox', () => {
            component.passwordParameters = {
                mustConsistCapitalLetters: false,
            };
            expect(component.renderCapitalCheckbox()).toBeUndefined();

            component.passwordParameters = {
                mustConsistCapitalLetters: true,
            };
            expect(component.renderCapitalCheckbox()).toMatchObject(
                {"$attrs$": {"checked": false, "id": "terms", "label": "Capital letters", "readonly": true}, "$children$": null, "$elm$": null, "$flags$": 0, "$key$": null, "$name$": null, "$tag$": "limel-checkbox", "$text$": null}
            );
        });

        it('Test render number checkbox', () => {
            component.passwordParameters = {
                mustConsistNumericCharacter: false,
            };
            expect(component.renderNumberCheckbox()).toBeUndefined();

            component.passwordParameters = {
                mustConsistNumericCharacter: true,
            };
            expect(component.renderNumberCheckbox()).toMatchObject(
                {"$attrs$": {"checked": false, "id": "terms", "label": "Numeric characters", "readonly": true}, "$children$": null, "$elm$": null, "$flags$": 0, "$key$": null, "$name$": null, "$tag$": "limel-checkbox", "$text$": null}
            );
        });

        it('Test render special checkbox', () => {
            component.passwordParameters = {
                mustConsistSpecialChracters: false,
            };
            expect(component.renderSpecialCheckbox()).toBeUndefined();

            component.passwordParameters = {
                mustConsistSpecialChracters: true,
            };
            expect(component.renderSpecialCheckbox()).toMatchObject(
                {"$attrs$": {"checked": false, "id": "terms", "label": "Special characters", "readonly": true}, "$children$": null, "$elm$": null, "$flags$": 0, "$key$": null, "$name$": null, "$tag$": "limel-checkbox", "$text$": null}
            );
        });

        it('Test render min length checkbox', () => {
            component.passwordParameters = {
                mustConsistLowerCaseLetters: false,
            };
            expect(component.renderMinLengthCheckbox()).toBeUndefined();

            component.passwordParameters = {
                minLength: 10,
            };
            expect(component.renderMinLengthCheckbox()).toMatchObject(
                {"$attrs$": {"checked": false, "id": "terms", "label": "Minimum length 10", "readonly": true}, "$children$": null, "$elm$": null, "$flags$": 0, "$key$": null, "$name$": null, "$tag$": "limel-checkbox", "$text$": null}
            );
        });

        it('Test render max length checkbox', () => {
            component.passwordParameters = {
                mustConsistLowerCaseLetters: false,
            };
            expect(component.renderMaxLengthCheckbox()).toBeUndefined();

            component.passwordParameters = {
                maxLength: 10,
            };
            expect(component.renderMaxLengthCheckbox()).toMatchObject(
                {"$attrs$": {"checked": false, "id": "terms", "label": "Maximum length of 10", "readonly": true}, "$children$": null, "$elm$": null, "$flags$": 0, "$key$": null, "$name$": null, "$tag$": "limel-checkbox", "$text$": null}
            );
        });

        it('Test render all checkbox', () => {
            component.showPasswordParameters = false;
            component.passwordParameters = {
                mustConsistCapitalLetters: false,
                mustConsistLowerCaseLetters: false,
                mustConsistNumericCharacter: false,
                mustConsistSpecialChracters: false,
            };

            expect(component.renderPasswordParameters()).toBeUndefined();

            component.showPasswordParameters = true;
            expect(component.renderPasswordParameters()).toMatchObject(
                {}
            );
        });
    });
});