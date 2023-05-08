export default {
    data() {
        return {
            isFirstNameWrong: false,
            isEmailLoginWrong: false,
            isSurnameWrong: false,
            isMiddleNameWrong: false,
            isEmailRegisterWrong: false,
            isPhoneNumberWrong: false,

            isFirstNameNull: false,
            isEmailLoginNull: false,
            isSurnameNull: false,
            isMiddleNameNull: false,
            isEmailRegisterNull: false,
            isPhoneNumberNull: false,

            isPasswordLoginNull: false,
            isPasswordRegisterNull: false,

            regexAlpha: /[^a-zA-ZА-яЁё]/gmi,
            regexNumber: /[^0-9]/g,
        }
    },
    methods: {
        validateRegMail(mail) {
            this.checkMailReg(mail);
            if (this.isEmailRegisterNull) return false;
            if (!this.isEmailRegisterNull) this.isEmailRegisterWrong = this.isMailInvalid(mail);
            return this.isEmailRegisterWrong;
        },

        validateLoginMail(mail) {
            this.checkMailLog(mail);
            if (this.isEmailLoginNull) return false;
            if (!this.isEmailLoginNull) this.isEmailLoginWrong = this.isMailInvalid(mail);
            return this.isEmailLoginWrong;
        },

        isMailInvalid(mail) {
            if (mail.match(/[\s]/g)) return true;
            const dogHunter = mail.split('@');
            if (dogHunter.length !== 2) return true;
            const dotHunter = dogHunter[1].split('.');
            if (dotHunter.length >= 2) {
                return !!dotHunter.some(el => el == false);
            } else {
                return true;
            }
        },

        checkLoginPass(pass) {
            this.isPasswordLoginNull = pass.length === 0;
            return this.isPasswordLoginNull;
        },

        checkRegPass(pass) {
            this.isPasswordRegisterNull = pass.length === 0;
            return this.isPasswordRegisterNull;
        },

        checkFirstNameInput(val) {
            this.isFirstNameNull = val.length === 0;
            return this.isFirstNameNull;
        },

        checkSurnameInput(val) {
            this.isSurnameNull = val.length === 0;
            return this.isSurnameNull;
        },

        checkMiddleNameInput(val) {
            this.isMiddleNameNull = val.length === 0;
            return this.isMiddleNameNull;
        },

        checkMailLog(val) {
            this.isEmailLoginNull = val.length === 0;
            return this.isEmailLoginNull;
        },

        checkMailReg(val) {
            this.isEmailRegisterNull = val.length === 0;
            return this.isEmailRegisterNull;
        },

        checkPhoneInput(val) {
            this.isPhoneNumberNull = val.length === 0;
            return this.isPhoneNumberNull;
        },
    },
    watch: {
        firstName(newName) {
            this.isFirstNameWrong = newName.match(this.regexAlpha);
            this.isFirstNameNull = false;
        },
        surname(newName) {
            this.isSurnameWrong = newName.match(this.regexAlpha);
            this.isSurnameNull = false;
        },
        middleName(newName) {
            this.isMiddleNameWrong = newName.match(this.regexAlpha);
            this.isMiddleNameNull = false;
        },
        phone(newName) {
            this.isPhoneNumberWrong= newName.toString().match(this.regexNumber)

            this.isPhoneNumberNull = false;
        },
        passwordLogin() {
            this.isPasswordLoginNull = false;
        },
        passwordRegister() {
            this.isPasswordRegisterNull = false;
        },
        emailLogin() {
            this.isEmailLoginNull = false;
        },
        emailRegister() {
            this.isEmailRegisterNull = false;
        }
    }
}
