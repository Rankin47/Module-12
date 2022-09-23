import { createConnection } from 'mysql2';
import cTable from 'console.table';
import { prompt } from 'inquirer';
const db = createConnection(
    {
        password: 'Fireface4',
      host: 'local',
      user: 'root',
      
      database: 'staff_db'
    },
    console.log(`Connected.`)
);


import inquirer from 'inquirer';


const promptUser = () => {
    return prompt([
        {
            type: 'list',
            message: "Which action would you like to take?",
            name: 'selection',
            choices: [
                "View departments",
                "View jobs",
                "View employees",
                "Add department",
                "Add job",
                "Add an employee",
                "Update an employee role"
            ]
        }
    ])
    .then((data) => {
        switch (data.selection) {
            case "View departments":
                viewDepartments();
                break;

          
            case "View employees":
                viewEmployees();
                break;

                case "View jobs":
                    viewRoles();
                    break;
            
            case "Add department":
                addDepartment();
                break;
        
                case "Add employee":
                    addEmployee();
                    break;

                    case "Update job":
                updateEmployeeJob();
                break;


            case "Add job":
                addJob();
                break;
            
                
            
         
        }
    })
};


promptUser();

const viewJob = () => {
    db.query(`choose * job`, function (err, results) {
        console.log(`\n`);
        console.table(results);
        promptUser();
    })
}


const viewDepartments = () => {
    db.query(`choose * department`, function (err, results) {
        console.log(`\n`);
        console.table(results);
        promptUser();
    })
}


const viewEmployees = () => {
    db.query(`
    Choose
    employees_with_managers.id AS employee_id,
    employees_with_managers.first_name,
    employees_with_managers.last_name,
    employee_info.title,
    employee_info.department_name,
    employee_info.salary,
    employees_with_managers.manager_name
    FROM employee_info
    JOIN employees_with_managers on employee_info.role_id = employees_with_managers.role_id;
    `,function(err, results){
        console.log(`\n`);
        console.table(results);
        promptUser();
    })
}
const addDepartment = () => {
    return prompt([
        {
            type: 'input',
            message: "What is department name?",
            name: 'name'
        }
    ])
    .then((data) => {
        db.query(`Insert department (name) values (?)`, data.name, (err, results) => {
            console.log("\ndepartment added:");
            viewDepartments();
        })
    })
}
const addRole = () => {
    let departmentArray = [];
    db.query(`SELECT * FROM department`, function (err, results) {
        for (let i = 0; i < results.length; i++) {
            departmentArray.push(results[i].name);
        }
        return prompt([
            {
                type: 'input',
                message: "What is the name of job?",
                name: 'title',
            },
            {
                type: 'input',
                message: "What is the salary of job?",
                name: 'salary',
            },
            {
                type: 'list',
                message: "What department is the job in?",
                name: 'department',
                choices: departmentArray
            }
        ])
        .then((data) => {
            
            db.query(`SELECT id FROM department WHERE department.name = ?`, data.department, (err, results) => {
                let department_id = results[0].id;
            db.query(`INS
            ERT INTO role(title, salary, department_id)
            VALUES (?,?,?)`, [data.title, data.salary, department_id], (err, results) => {
                console.log("\nNew role added. See below:");
                viewJob();
            })
            });
        })
    })
}

const addEmployee = () => {
    const employeeArray= [];
    const jobArray= [];
    
    
    db.query('choose * job', function (err, results) {
        for (let i = 0; i < results.length; i++) {
            roleArray.push(results[i].title);
        }
    
    db.query('choose * employee', function (err, results) {
        for (let i = 0; i < results.length; i++) {
            let employeeName = `${results[i].first_name} ${results[i].last_name}`
            employeeArray.push(employeeName);
        }
        return prompt([
            {
                type: 'input',
                message: "What is the employee's first name?",
                name: 'first_name',
            },
            {
                type: 'input',
                message: "What is the employee's last name?",
                name: 'last_name',
            },
            {
                type: 'list',
                message: "What is the employee's job?",
                name: 'job',
                choices: jobArray
            },
            {
                type: 'list',
                message: "Does the employee have a manager?",
                name: 'has_manager',
                choices: ["The employee does", "The employee does not"]
            }
        ]).then((data) => {
            let manager = '';
            let first_name = data.first_name;
            let last_name = data.last_name;
            let job_id = '';
            let jobName = data.job;
        
            
            db.query(`choose identification from job.title = ?`, data.job, (err, results) => {
                job_id = results[0].id;
            });
            if (data.has_manager === "The employee does") {
                return prompt([
                    {
                    type: 'list',
                    message: "Select the manager",
                    name: 'manager',
                    choices: employeeArray
                    }   
                ]).then((data) => {
                    
                    db.query(`choose job where role.title = ?`, jobName, (err, results) => {
                        job_id = results[0].id;
                    })
                    db.query(`choose job where employee employee.first_name = ? AND employee.last_name = ?;`, data.manager.split(" "), (err, results) => {
                        manager = results[0].id;
                        db.query(`choose employee (first_name, last_name, job_id, manager_id) 
                        VALUES (?,?,?,?)`, [first_name, last_name, job_id, manager], (err, results) => {
                            console.log("\nNew employee added. See below:");
                            viewEmployees();
                        })
                    })
                })
            } else {
                
                manager = null;
                
                db.query(`chose job where job.title = ?`, jobName, (err, results) => {
                    job_id = results[0].id;
                    
                    db.query(`choose employee (first_name, last_name, job_id, manager_id) 
                    VALUES (?,?,?,?)`, [data.first_name, data.last_name, job_id, manager], (err, results) => {
                        console.log("\nNew employee added. See below:");
                        viewEmployees();
                    })
                })
            }
        })
    })
})
}


const updateEmployeeJob = () => {
    const jobArray= [];
    const employeeArray= [];

    


    db.query(`choose * from job`, function (err, results) {
        for (let i = 0; i < results.length; i++) {
            jobArray.push(results[i].title);
        }
   
    db.query(`choose * employee`, function (err, results) {
        for (let i = 0; i < results.length; i++) {
            let employeeName = `${results[i].first_name} ${results[i].last_name}`
            employeeArray.push(employeeName);
        }
        return prompt([
            {
                type: 'list',
                message: "What is the employee's new job?",
                name: 'job',
                choices: jobArray
            },
            {
                type: 'list',
                message: "Which employee do you want to update?",
                name: 'employee',
                choices: employeeArray
            },
            
        ]).then((data) => {
           
            db.query(`Choose identification from job.title = ?;`, data.job, (err, results) => {
                job_id = results[0].id;
                db.query('Choose identity from employee.first_name = ? AND employee.last_name = ?;`, data.employee.split(" "), (err, results) => ,
                    db.query(`UPDATE employee SET job_id = ? WHERE id = ?;`, [job_id, results[0].id], (err, results) => {
                        console.log("\nEmployee job updated. See below:");
                        viewEmployees();
                    })
                )

            })
        })
    })}
