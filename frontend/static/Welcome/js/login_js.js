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

        recovery: function() {
            this.isRecovery = true;
        },

        back: function() {
            this.isRecovery = false;

        },

        ok: function() {
            this.isRecovery = false;
            this.login_visible = !this.login_visible;
            this.register_visible = !this.register_visible;
        }
    }
})
