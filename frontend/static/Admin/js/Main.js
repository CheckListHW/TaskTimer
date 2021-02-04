new Vue ({
    el: '#projectList',
    data: {
        projects_list: [],

        isAdded: false,
        enterdName: "",

        activeProject: -1,
        isDeleted: false,
        isEdited: false,

        newProjectCount: 0,

        editedName: "",
    },

    computed: {
    },

    methods: {
        addNewProject: async function() {
            var str = this.enterdName;
            if(str == "") {
                this.newProjectCount += 1;
                str = "Новый проект " + this.newProjectCount;
            }

            var newProject = {
                name: str,
                menuVisible: false,
            };
            this.projects_list.push(newProject);
            let projects = (await axios.get('/api/project')).data

            console.log(projects);
            this.isAdded = false;
            this.enterdName = "";
        },

        cancel: function() {
            this.isAdded = false;
            this.enterdName = "";
        },

        changeVisible: function(index) {
            if(!this.isDeleted) {
                if(this.activeProject >= 0) {
                    var temp = {
                        name: this.projects_list[this.activeProject].name,
                        menuVisible: false,
                    }
                    Vue.set(this.projects_list, this.activeProject, temp);
                }

                var temp = {
                    name: this.projects_list[index].name,
                    menuVisible: true,
                }
                Vue.set(this.projects_list, index, temp);
                this.activeProject = index;

                if(this.isEdited) {
                    this.editedName = this.projects_list[index].name;
                }
            }
            this.isDeleted = false;
        },

        editProject: function(index) {
            this.isEdited = true;
            this.editedName = this.projects_list[index].name;
        },

        deleteProject: function(index) {
            this.projects_list.splice(index, 1);
            this.activeProject = -1;
            this.isDeleted = true;
        },

        saveEdit: function() {
            var str = this.editedName;
            if(str == "") {
                this.newProjectCount += 1;
                str = "Новый проект " + this.newProjectCount;
            }

            var newProject = {
                name: str,
                menuVisible: false,
            };

            Vue.set(this.projects_list, this.activeProject, newProject);

            this.isEdited = false;
            this.editedName = "";

            this.activeProject = -1;
        },

        cancelEdit: function() {
            this.isEdited = false;
            this.editedName = "";

            var temp = {
                name: this.projects_list[this.activeProject].name,
                menuVisible: false,
            }
            Vue.set(this.projects_list, this.activeProject, temp);
            this.activeProject = -1;
        },
    }
})
