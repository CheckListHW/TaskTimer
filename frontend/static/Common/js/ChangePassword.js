new Vue ({
    el: '#password',
    data: {
        user: {
            name: "Петр",
            surname: "Обухов",
            patronymic: "Кириллович",
            email: "petr5542@gmail.com",
        },

        newPassword: "",
        repeatNewPassword: "",

        message: "",
    },

    computed: {
        isEntered:  function() {
            if(this.newPassword !== "" && this.repeatNewPassword !==
            "" && this.newPassword === this.repeatNewPassword) {
                this.message = "Пароли совпадают";
                return true;
            }
            else if(this.newPassword !== "" && this.repeatNewPassword !==
            "" && this.newPassword !== this.repeatNewPassword) {
                this.message = "Пароли не совпадают";
                return true;
            }
            else {
                return false;
            }
        },

        isCorrect:async function() {
            if(this.newPassword != "" && this.newPassword == this.repeatNewPassword) {
                return false;
                console.log()
            }
            else {
                return true;
                console.log()
            }
        },
    },

    methods: {
        sent: function() {

            this.newPassword = "";
            this.repeatNewPassword = "";
            this.message = "";
        },

        change: function() {

        }
    }
})
