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

        login_visible: true,
        register_visible: false,
    },
    methods: {
        change: function() {
            this.login_visible = !this.login_visible;
            this.register_visible = !this.register_visible;
        },
    }
})
