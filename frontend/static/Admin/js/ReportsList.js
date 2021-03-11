const TOTAL_TIME_EMP = 'Итого по сотруднику',
    TOTAL_TIME_PROJECT = 'Итого по проекту',
    USER_TYPE = document.getElementById('user_group').name

Vue.component ('pretty_time', {
    props: ['value'],

    template: '<p>{{computed_time | prettify}}</p>',

    computed: {
        computed_time() {
            var time = this.value / 3600;
            var hours = parseInt(time);
            var minutes = Math.ceil((time - hours) * 60);
            return hours + ":" + minutes;
        }
    },

    filters: {
        prettify : function(value) {
            var data = value.split(':');
            var hours = data[0];
            var minutes = data[1];
            if (hours == 0 & minutes == 0){
                return "-"
            }
            return hours + ":" + minutes;
        }
    }
})

Vue.component('report_row', {
    props: ['employee', 'index', 'projects', 'startdate', 'enddate'],

    template: `<tr>
                    <td>{{index + 1}}</td>
                    <td>{{employee_string(employee.name)}}</td>
                    <td v-for="(project, index) in projects">
                        <pretty_time   :value="projectTime(project.name, employee.projectsList)"
                                       :key="index">
                        </pretty_time>
                    </td>
                </tr>`,

    methods: {
        employee_string: function(name) {
            var result = "";
            var array = name.split(' ');

            result += array[0] + " ";
            result += array[1][0] + ". ";
            result += array[2][0] + ".";

            return result;
        },

        findProjects: function(array) {
            var result = [];
            var sDate = new Date(this.startdate.year, this.startdate.month, this.startdate.day);
            var eDate = new Date(this.enddate.year, this.enddate.month, this.enddate.day);

            for(var i = 0; i < array.length; i++) {
                var pDate = new Date(array[i].date.year, array[i].date.month, array[i].date.day);

                if((pDate >= sDate && pDate <= eDate)) {
                    result.push(array[i]);
                }
            }

            return result;
        },

        projectTime: function(element, array) {
            var modifiedArray = this.findProjects(array);

            //Подсчет суммы по сотруднику
            if (element === TOTAL_TIME_EMP & USER_TYPE === 'admin'){
                let totalTime = 0
                modifiedArray.forEach(item => {totalTime += item.time})
                return totalTime
            }
            //Подсчет суммы по сотруднику

            var summArray = Object.fromEntries(modifiedArray.map(item => [item.name, 0]));
            modifiedArray.forEach(item => {summArray[item.name] += item.time})

            if(summArray[element] != null) {
                return summArray[element];
            }
            else {
                return 0;
            }
        },
    }
});

new Vue ({
    el: '#reportList',
    data: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        startdate: {
            year: 2011,
            month: 0,
            day: 1,
        },
        enddate: {
            year: 2021,
            month: 2,
            day: 1,
        },
        users:[],
        projects: [],
        const_projects: [],

        employees: [],
    },

    computed: {
        isDateChoose: function() {
            const vm = this;
            let StartDate = new Date(vm.startdate.year, vm.startdate.month, vm.startdate.day)
            let StartDateDb = StartDate.toLocaleDateString('fr-CA')
            let EndDate = new Date(vm.enddate.year, vm.enddate.month, vm.enddate.day)
            let EndDateDb = EndDate.toLocaleDateString('fr-CA')
            vm.update_reports('StartDate='+StartDateDb, 'EndDate='+EndDateDb)

            if(this.startdate.year > 0 && this.startdate.month >= 0 && this.startdate.day > 0 && this.enddate.year > 0 && this.enddate.month >= 0 && this.enddate.day > 0) {
                return true;
            }
            else {
                return false;
            }
        },
    },

    methods: {
        update_reports:async function(StartDate, EndDate){
            const vm = this;

            let projectActive = (await axios.get('/api/project_history/?'+StartDate+'&'+EndDate)).data
            vm.employees = []
            vm.projects = []

            vm.users.forEach(function (user) {
               vm.employees.push({
                    name: user.first_name+' '+user.last_name+' '+user.patronymic,
                    projectsList: get_project_list(projectActive, user.id),
                })
            })

            if (USER_TYPE === 'admin'){
                vm.employees.push({
                    name: TOTAL_TIME_PROJECT,
                    projectsList: get_project_list(projectActive),
                })
            }
            let project_dict = {}

            vm.employees.forEach(function (employee) {
                employee.projectsList.forEach(function (project) {
                    project_dict[project.name] = project.name
                })
            })


            for (let i = 0; i<vm.const_projects.length;i++){
                if (project_dict[vm.const_projects[i].name] != null){
                    vm.projects.push(vm.const_projects[i])
                }
            }


        },

        get_years: function () {
            var today = new Date();
            var count = 10;
            var start_year = today.getFullYear() - count;

            var array = Array(count + 1).fill().map((e, i) => i + start_year);

            return array;
        },

        get_dates: function (year, month) {
            if(year && (month + 1)) {
                var array = [];
                var max_date = this.get_final_date(year, month);
                if(max_date) {
                    array = Array(max_date).fill().map((e, i) => i + 1);
                }

                return array;
            } else {
                return [];
            }
        },

        modify: function (date) {
            var day = this.get_final_date(date.year, date.month);
        },

        get_final_date: function (year, month) {
            var date = new Date(year, month + 1, 0);
            return date.getDate();
        }
    },

    created: async function() {
        const vm = this;

        vm.users = (await axios.get('/api/user')).data


        date = new Date()
        vm.startdate = {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: 9,
        }


        vm.enddate = {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: 9,
        }


        let projects = (await axios.get('/api/project')).data

        projects.forEach(function (project) {
            var newProject = {
                id:project.id ,
                name: project.Name,
            };
            vm.const_projects.push(newProject);
        })

        if (USER_TYPE === 'admin')
            vm.const_projects.push( {
                id:0,
                name: TOTAL_TIME_EMP,
        })
    }
})


function get_project_list(projectActive, user_id = null) {
    let temp_projectActive = []
    const P_A_TEMPLATE = {
        name: null,
        time: 0,
        note: "",
        inputedNote: "",
        isAddNote: false,

        timer: null,
        timeStart: {
            minutes: 0,
        },

        timeEnd: {
            hour: 0,
            minutes: 0,
        },

        date: {
            year: null,
            month: null,
            day: null,
        },

        isDone: true,
        isPlayed: true,
    }

    projectActive.forEach(function (p_a) {
        if ((user_id === null || p_a.Owner === user_id) & p_a.End != null){
            let date_parse = new Date(Date.parse(p_a.Date))
            let new_p_a = Object.assign({}, P_A_TEMPLATE);
            new_p_a.name =  p_a.Name
            new_p_a.time = (Date.parse(p_a.End) - Date.parse(p_a.Start))/1000
            new_p_a.date =   {
                year: date_parse.getFullYear(),
                month: date_parse.getMonth(),
                day: date_parse.getDate(),
            }
            new_p_a.name =  p_a.Name
            new_p_a.name =  p_a.Name
            temp_projectActive.push(new_p_a)
        }
    })


    /*let totaltime = 0
    temp_projectActive.forEach(item => {totaltime+=item.time})
    let new_p_a = Object.assign({}, P_A_TEMPLATE);
    new_p_a.name = TOTAL_TIME_EMP
    new_p_a.time = totaltime
    temp_projectActive.push(new_p_a)*/

    return temp_projectActive
}