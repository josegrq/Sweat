const Sweat = Vue.createApp({
    /**/
    data: function () {
        return {
            errors: [],
            firstName: null,
            lastName: null,
            username: null,
            email: null,
            confirmEmail: null,
            password: null,
            confirmPassword: null,
            street: null,
            state: null,
            gender: null,
            dob : null,
            city: null,
            zipCode: null,
            question: null,
            answer: null,
            bio: null,
            options: [
                { id: 0, value: "" },
                { id: 1, value: "What was your first place of employment?" },
                { id: 2, value: "What was your schools mascot?" },
                { id: 3, value: "What is your favorite team?" },
                { id: 4, value: "What is your favorite workout?" }
            ],
            passwordRules: [
                { message: 'One lowercase letter required.', regex: /[a-z]+/ },
                { message: "One uppercase letter required.", regex: /[A-Z]+/ },
                { message: "One number required.", regex: /[0-9]+/ },
                { message: "3 characters minimum.", regex: /.{3,}/ }

            ]
        }
    },
    
    methods: {
        checkForm: function (e) {
            this.errors = [];

            /*First Name*/
            if (!this.firstName) {
                this.errors.push("First Name required.");
                document.getElementsByName("firstName")[0].style.backgroundColor = "red";
            } else if (!this.vaildText(this.firstName)) {
                this.errors.push('Invalid characters in First Name.');
                document.getElementsByName("firstName")[0].style.backgroundColor = "red";
            }
            /*Last Name*/
            if (!this.lastName) {
                this.errors.push("Last Name required.");
                document.getElementsByName("lastName")[0].style.backgroundColor = "red";
            } else if (!this.vaildText(this.lastName)) {
                this.errors.push('Invalid characters in Last Name.');
                document.getElementsByName("lastName")[0].style.backgroundColor = "red";
            }
            /*Username*/
            if (!this.username) {
                this.errors.push("User Name required.");
                document.getElementsByName("username")[0].style.backgroundColor = "red";
            } else if (!this.vaildText(this.username)) {
                this.errors.push('Invalid characters in User Name.');
                document.getElementsByName("username")[0].style.backgroundColor = "red";
            }
            /*Email*/
            if (!this.email) {
                this.errors.push('Email required.');
                document.getElementsByName("email")[0].style.backgroundColor = "red";
            } else if (!this.validEmail(this.email)) {
                this.errors.push('Valid email required.');
                document.getElementsByName("email")[0].style.backgroundColor = "red";
            }

            if (!this.confirmEmail) {
                this.errors.push('Please confirm email address.');
                document.getElementsByName("confirmEmail")[0].style.backgroundColor = "red";
            } else if (this.email != this.confirmEmail) {
                this.errors.push('Email and Email Confirmation do not match');
                document.getElementsByName("email")[0].style.backgroundColor = "red";
                document.getElementsByName("confirmEmail")[0].style.backgroundColor = "red";
            }
            /*Password*/
            if (!this.password) {
                this.errors.push("Password required.");
                document.getElementsByName("password")[0].style.backgroundColor = "red";
            }
            if (!this.confirmPassword) {
                this.errors.push("Please confrim your password.");
                document.getElementsByName("confirmPassword")[0].style.backgroundColor = "red";
            } else if (this.password != this.confirmPassword) {
                this.errors.push('Password and Password confirmation do not match');
                document.getElementsByName("confirmPassword")[0].style.backgroundColor = "red";
                document.getElementsByName("password")[0].style.backgroundColor = "red";
            } else {
                for (let condition of this.passwordRules) {
                    if (!condition.regex.test(this.password)) {
                        this.errors.push(condition.message);
                        document.getElementsByName("password")[0].style.backgroundColor = "red";
                    }
                }
            }
            /*Address*/
            if (!this.vaildText(this.street)) {
                this.errors.push('Invalid characters in Street Address.');
                document.getElementsByName("street")[0].style.backgroundColor = "red";
            }
            if (!this.vaildText(this.city)) {
                this.errors.push('Invalid characters in City field.');
                document.getElementsByName("city")[0].style.backgroundColor = "red";
            }
            if (!this.vaildText(this.state)) {
                this.errors.push('Invalid characters in State field.');
                document.getElementsByName("state")[0].style.backgroundColor = "red";
            }
            if (!this.vaildText(this.zipCode)) {
                this.errors.push('Invalid characters in Zipcode field.');
                document.getElementsByName("zipCode")[0].style.backgroundColor = "red";
            }

            /*Security Question*/
            if (!this.answer) {
                this.errors.push('Security Question is required.');
                document.getElementsByName("question")[0].style.backgroundColor = "red";
            }
            else if (!this.vaildText(this.answer)) {
                this.errors.push('Invalid characters in Security field.');
                document.getElementsByName("question")[0].style.backgroundColor = "red";
            }

            /*Bio*/
            if (!this.vaildText(this.bio)) {
                this.errors.push('Invalid characters in Biography field.');
                document.getElementsByName("bio")[0].style.backgroundColor = "red";
            }



            if (!this.errors.length) {
                return true;/*No ERRORS! WOW! SO COOL! YOUR GREAT!*/
            }

            e.preventDefault();
        },

        validEmail: function (email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },

        vaildText: function (text) {
            var re = /[A-Za-z0-9 ._^%$!~@,]/g;
            return re.test(text);
        }

    }

});