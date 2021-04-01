const TOTAL_TIME_EMP = 'Итого по сотруднику',
    TOTAL_TIME_PROJECT = 'Итого по проекту',
    USER_TYPE = document.getElementById('user_group').name,
    DATE_MAIN = new Date()

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
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
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
            return outFindProjects(array, this.startdate, this.enddate)
        },

        projectTime: function(element, array) {
            return outProjectTime(element, array, this.startdate, this.enddate)
        },
    }
});

function outFindProjects(array, startDate, endDate) {
    var result = [];
    var sDate = new Date(startDate.year, startDate.month, startDate.day);
    var eDate = new Date(endDate.year, endDate.month,  endDate.day);

    for(var i = 0; i < array.length; i++) {
        var pDate = new Date(array[i].date.year, array[i].date.month, array[i].date.day);

        if((pDate >= sDate && pDate <= eDate)) {
            result.push(array[i]);
        }
    }

    return result;
}

function outProjectTime(element, array, startDate, endDate) {
    var modifiedArray = outFindProjects(array, startDate, endDate);


    //Подсчет суммы по сотруднику
    if (element === TOTAL_TIME_EMP & USER_TYPE === 'admin'){
        let totalTime = 0
        modifiedArray.forEach(item => {totalTime += item.time})
        return totalTime
    }
    //Подсчет суммы по сотруднику

    var sumArray = Object.fromEntries(modifiedArray.map(item => [item.name, 0]));
    modifiedArray.forEach(item => {sumArray[item.name] += item.time})

    if(sumArray[element] != null) {
        return sumArray[element];
    }
    else {
        return 0;
    }
}

new Vue ({
    el: '#reportList',

    data: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],

        startdate: {
            year: null,
            month: null,
            day: null,
        },

        enddate: {
            year: null,
            month: null,
            day: null,
        },

        inputStart: null,
        inputEnd: null,

        users:[],
        projects: [],
        const_projects: [],

        employees: [],
    },

    computed: {
        isDateChoose: function() {
            const vm = this;

            if (vm.inputEnd < vm.inputStart){
                vm.inputStart = vm.inputEnd
            }

            document.getElementById("startDate").setAttribute('max', vm.inputEnd)

            let startParseTime = new Date()
            startParseTime.setTime(Date.parse(vm.inputStart))

            this.startdate = {
                year: startParseTime.getFullYear(),
                month: startParseTime.getMonth(),
                day: startParseTime.getDate(),
            }

            let endParseTime = new Date()
            endParseTime.setTime(Date.parse(vm.inputEnd))

            this.enddate = {
                year: endParseTime.getFullYear(),
                month: endParseTime.getMonth(),
                day: endParseTime.getDate(),
            }

            if(this.startdate.year > 0 && this.startdate.month >= 0 && this.startdate.day > 0 && this.enddate.year > 0 && this.enddate.month >= 0 && this.enddate.day > 0) {
                vm.update_reports('StartDate='+vm.inputStart, 'EndDate='+vm.inputEnd)
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
                    name: user.last_name+' '+user.first_name+' '+user.patronymic,
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

            if (USER_TYPE === 'admin'){
                vm.projects.push({
                    id:0,
                    name: TOTAL_TIME_EMP,
                })
            }

        },

        saveReport: function(){
            var headers = {
                number: '№'.replace(/,/g, ''), // remove commas to avoid errors
                name: "ФИО сотрудника",
            };

            const vm = this;

            vm.projects.forEach(function (item) {
                headers[item.name] = item.name
            })

            var itemsFormatted = [];

            vm.employees.forEach((item, i) => {
                itemsFormatted.push({
                    number: i+1,
                    model: item.name.replace(/,/g, ''),
                });
                 vm.projects.forEach(function (pL) {
                    itemsFormatted[i][pL.name] = vm.timeFromSecond(outProjectTime(pL.name, item.projectsList, vm.startdate, vm.enddate))
                })
                itemsFormatted[i][TOTAL_TIME_EMP] = vm.timeFromSecond(outProjectTime(TOTAL_TIME_EMP, item.projectsList, vm.startdate, vm.enddate))
            });

            var fileTitle = 'Report_'+vm.inputStart+'_'+vm.inputEnd;

            exportCSVFile(headers, itemsFormatted, fileTitle)
        },

        timeFromSecond: function(totalSecond){
            if (isNaN(totalSecond) || totalSecond == 0){
                return '-'
            }
            var time = totalSecond/ 3600
            var hours = parseInt(time);
            var minutes = Math.ceil((time - hours) * 60);
            let second = parseInt(totalSecond % 60)
            return hours + ' : ' + minutes + ' : ' + second;
        },

        get_final_date: function (year, month) {
            var date = new Date(year, month + 1, 0);
            return date.getDate();
        }
    },

    created: async function() {
        const vm = this;

        vm.users = (await axios.get('/api/user/')).data

        let projects = (await axios.get('/api/project/')).data

        projects.forEach(function (project) {
            vm.const_projects.push({
                id:project.id ,
                name: project.Name,
            });
        })

        if (USER_TYPE === 'admin')
            vm.const_projects.push({
                id:0,
                name: TOTAL_TIME_EMP,
        })

        vm.startdate.year = DATE_MAIN.getFullYear()
        vm.startdate.month = DATE_MAIN.getMonth()
        vm.startdate.day = 1

        vm.enddate.year = DATE_MAIN.getFullYear()
        vm.enddate.month = DATE_MAIN.getMonth()
        vm.enddate.day = DATE_MAIN.getDate()

        let StartDateDb = new Date(vm.startdate.year, vm.startdate.month, vm.startdate.day).toLocaleDateString('fr-CA')
        let EndDateDb = new Date(vm.enddate.year, vm.enddate.month, vm.enddate.day).toLocaleDateString('fr-CA')

        vm.inputStart = StartDateDb
        vm.inputEnd = EndDateDb

        document.getElementById("startDate").setAttribute('max', EndDateDb)
        document.getElementById("endDate").setAttribute('max', EndDateDb)

        vm.update_reports('StartDate='+StartDateDb, 'EndDate='+EndDateDb)
    },
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
            hour: 0,
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
            new_p_a.date = {
                year: date_parse.getFullYear(),
                month: date_parse.getMonth(),
                day: date_parse.getDate(),
            }
            temp_projectActive.push(new_p_a)
        }
    })


    return temp_projectActive
}