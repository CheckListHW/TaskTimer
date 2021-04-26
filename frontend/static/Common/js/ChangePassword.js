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

        isCorrect:function() {
            if(this.newPassword != "" && this.newPassword == this.repeatNewPassword) {
                return false;
            }
            else {
                return true;
            }
        },
    },

    methods: {
        sent:async function() {
            response_message = await axiospost('/change/password', {
                    newPassword: this.newPassword,
                    repeatNewPassword: this.repeatNewPassword,
                })

                if (response_message > 0){
                    Toast.add({
                            text: 'Проект: '+this.chosenProject.name+' добавлен!',
                            color: '#ffe600',
                            delay: 3000,
                    });
                }
                else{
                    Toast.add({
                        text: response_message,
                        color: '#ff0000',
                        delay: 10000,
                    });
                    return
                }
            this.newPassword = "";
            this.repeatNewPassword = "";
            this.message = "";
        },

        change: function() {

        }
    }
})
