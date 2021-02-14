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
        lastEventId: null,
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

            newProjectId = await axiospost('/project/add',
                {
                    Name:newProject.name,
                    })

            if (newProjectId < 0)
                Toast.add({
                        text: 'Проект не добавлена!',
                        color: '#ff0000',
                        delay: 100000,
                    });
                return

            var newProject = {
                name: str,
                menuVisible: false,
                id:newProjectId,
            };

            this.projects_list.push(newProject);
            console.log(this.projects_list)

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

                    var temp = this.projects_list[this.activeProject]
                    temp.menuVisible = false
                    Vue.set(this.projects_list, this.activeProject, temp);
                }

                var temp = this.projects_list[index]
                temp.menuVisible = true

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
            axiospost('/project/delete',
            {
                id: this.projects_list[index].id,
            })



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

            console.log(this.projects_list[this.activeProject])

            axiospost('/project/edit',
            {
                id: this.projects_list[this.activeProject].id,
                Name: str,
            })
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
    },

    created: async function() {

        const vm = this;

        let projects = (await axios.get('/api/project')).data

        projects.forEach(function (project) {
            var newProject = {
                id:project.id ,
                name: project.Name,
                time: project.Time,
                menuVisible: false,
            };
            vm.projects_list.push(newProject);
        })
    }
})