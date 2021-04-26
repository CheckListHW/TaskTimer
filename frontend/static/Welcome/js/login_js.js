new Vue ({
    el: '#login',
    data: {
        login: {
            email: "",
            password: "",
        },
        register: {
            name: "",
            email: "",
            password: "",
            confirn_passford: "",
        },

        recoveryName: {
            name: "",
        },
        getRecovery: {
            cod: "",
            password: "",
            passwordRepeat: "",
        },

        login_visible: true,
        register_visible: false,

        isRecovery: false,
    },
    methods: {
        change: function() {
            this.login_visible = !this.login_visible;
            this.register_visible = !this.register_visible;
        },

        recovery:async function() {
            response_message = await axiospost('/recovery', {
                    username: this.recoveryName.name,
                })
            if (response_message !== 'True'){
                document.getElementById('error').innerHTML=response_message
                this.isRecovery = false;
                return
            }
            this.isRecovery = true;
        },

        back: function() {
            this.isRecovery = false;

        },

        ok:async function() {
            response_message = await axiospost('/recovery/change', {
                    username: this.recoveryName.name,
                    token: this.getRecovery.cod,
                    newPassword: this.getRecovery.password,
                    repeatNewPassword: this.getRecovery.passwordRepeat,
                })
            if (response_message !== 'True'){
                document.getElementById('error').innerHTML=response_message
                this.isRecovery = false;
                return
            }
            this.isRecovery = false;
            this.login_visible = !this.login_visible;
            this.register_visible = !this.register_visible;
        }
    }
})
