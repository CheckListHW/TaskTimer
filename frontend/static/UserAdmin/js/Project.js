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
                Name:str,
                })

            if (isNaN(newProjectId)){
                Toast.add({
                        text: 'Проект не добавлен: '+ newProjectId,
                        color: '#ff0000',
                        delay: 100000,
                    });
                return
            }


            var newProject = {
                name: str,
                menuVisible: false,
                id:newProjectId,
            };

            this.projects_list.unshift(newProject);
            this.isAdded = false;
            this.enterdName = "";

            if(this.activeProject >= 0) {
                this.activeProject++;
            }
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

        deleteProject: async function(index) {
            let deleteProj = (await axiospost('/project/delete',
            {
                id: this.projects_list[index].id,
            }))

            if (deleteProj == 'False'){
                Toast.add({
                        text: 'Проект: \"{project}\" нельзя удалить! Его уже начали выполнять.'
                            .replace('{project}', this.projects_list[index].name),
                        color: '#ff0000',
                        delay: 100000,
                    });
                return
            }
            Toast.add({
                text: 'Проект: \"{project}\" Удален.'
                    .replace('{project}', this.projects_list[index].name),
                color: '#37ff00',
                delay: 10000,
            });
            this.projects_list.splice(index, 1);
            this.activeProject = -1;
            this.isDeleted = true;
        },

        saveEdit: async function() {
            var str = this.editedName;
            if(str == "") {
                this.newProjectCount += 1;
                str = "Новый проект " + this.newProjectCount;
            }

            var newProject = {
                name: str,
                menuVisible: false,
            };


            newProjectId = await axiospost('/project/edit',
            {
                id: this.projects_list[this.activeProject].id,
                Name: str,
            })

            if (isNaN(newProjectId)){
                Toast.add({
                        text: 'Проект не добавлен: '+ newProjectId,
                        color: '#ff0000',
                        delay: 100000,
                    });
                return
            }

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