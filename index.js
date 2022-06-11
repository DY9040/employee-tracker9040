const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');

//const PORT = process.env.PORT || 3001;
const app = express();

//middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

//connect to my DB
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Moomilk123#@!',
        database: 'my_team_db'
    },
    console.log(`Connected to my_team_db.`)
);

//Questions start
const questions = () => {
    return inquirer.prompt(
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'type',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role','Add an Employee', 'Update employee role', 'Exit']
        }
    )
    .then(({ type }) => {
        if(type === 'View all departments'){
            return viewDepartments();
        }else if (type === 'View all roles'){
            return viewRoles();
        } else if (type === 'View all employees'){
            return viewEmployees();
        }else if (type === 'Add a department') {
            return addDepartment();
        }else if (type === 'Add a role') {
            return addRole();
        }else if (type === 'Add a employee') {
            return addEmployee();
        } else if (type === 'Update employee role') {
            return updateEmployeeRole();
        }else if (type === 'Exit') {
            return;
        }
    });
};
questions()

//render tables//

const viewDepartments = () => {

    //query the databases////
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results)
        return questions();
    });

    app.use((req, res) => {
        res.status(404).end();
    });
};

const viewRoles = () =>{
    const SQL = `SELECT title, department_id, department_name, salary FROM roles
    LEFT JOIN department ON roles.department_id = department.id`;

    db.query(SQL, function (err, results) {
        console.table(results)
        return questions();
    });
    app.use((req, res) => {
        res.status(404).end();
    });
};

const viewEmployees = () => {
    const SQL = `SELECT employee.id, first_name, last_name, department_name, salary, manager_id FROM employee
    LEFT JOIN roles ON employee.role_id = roles.id
    LEFT JOIN department ON roles.department_id = department.id`;


    db.query(SQL, function (err, results) {
        console.table(results)
        return questions();
    });
    app.use((req, res) => {
        res.status(404).end();
    });
};

const addDepartment = () => {
    inquirer.prompt(
        {
            type: 'input',
            name: 'departmentInput',
            message: 'What is the name of the department?',
            validate: titleInput => {
                if (titleInput) {
                    return true;
                }else {
                    console.log('Please enter a department!')
                    return false;
                }
            }
        }
    )
    .then(({ departmentInput }) => {
        const SQL = `INSERT INTO department (department_name) VALUES (?)`;
        const params = [departmentInput];
      //query the databases////
        db.query(SQL, params, function (err, results) {
          return questions();
      });
  
      app.use((req, res) => {
          res.status(404).end();
      });
    });
};

const addRole = () => {

var departmentSQL = `SELECT * FROM department`;
db.query(departmentSQL, (err, response) => {
    var departmentList = [];
    response.forEach((department) => {departmentList.push(`${department.department_name}`)});


    inquirer.prompt(
        [{
            type: 'input',
            name: 'titleInput',
            message: 'What is the title of the role?',
            validate: titleInput => {
                if (titleInput) {
                    return true;
                }else {
                    console.log('Please enter a title!')
                    return false;
                }
            }
        },
        {
            type: 'number',
            name: 'salaryInput',
            message: 'What is the salary of the role?',
            validate: titleInput => {
                if (titleInput) {
                    return true;
                }else {
                    console.log('Please enter a salary!')
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'departmentInput',
            message: 'What is the department of the role?',
            choices: departmentList
        }]
    )
    .then(({ titleInput, salaryInput, departmentList }) => {

        var departmentID;
        response.forEach((department) => {
            if (
                departmentInput === department.department_name
            ) {
                departmentID = department.id;
            }
        });

        const SQL = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
        const params = [titleInput, salaryInput, departmentID];
        //query the databases////
        db.query(SQL, params, function (err, results) {
        return questions();
    });

    app.use((req, res) => {
        res.status(404).end();
    });
    });
})};

const addEmployee = () => {

var employeeSQL = `SELECT * FROM employee LEFT JOIN roles ON employee.role_id = roles.id`;
db.query(employeeSQL, (err, response) => {
    var managerList = response.map(({ id, first_name, last_name }) => ({ name: first_name + ' ' + last_name, value: id }));

    var rolesList = [];
    response.forEach((role) => {rolesList.push(`${role.title}`)});

    inquirer.prompt(
        [{
            type: 'input',
            name: 'firstNameInput',
            message: 'What is the first name of the employee?',
            validate: titleInput => {
                if (titleInput) {
                    return true;
                }else {
                    console.log('Please enter a first name!')
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastNameInput',
            message: 'What is the last name of the employee?',
            validate: titleInput => {
                if (titleInput) {
                    return true;
                }else {
                    console.log('Please enter a last name!')
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'roleInput',
            message: 'What is the role of the employee?',
            choices: rolesList
        },
        {
            type: 'list',
            name: 'managerInput',
            message: 'Who is the manager of the employee?',
            choices: managerList
        }]
    )
    .then(({ firstNameInput, lastNameInput, roleInput, managerInput }) => {

        var rolesID;
        response.forEach((roles) => {
            if (
                roleInput === roles.title
            ) {
                rolesID = roles.id;
            }
        }
        );

        var managerID;
        response.forEach((employee) => {
            if (
                managerInput === employee.manager_id
            ) {
                managerID = employee.id;
            }
        }
        );


        const employeeSQL = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        const params = [firstNameInput, lastNameInput, rolesID, managerID];

    //query the databases////
   db.query(employeeSQL, params, function (err, results) {
        return questions();
    });

    app.use((req, res) => {
        res.status(404).end();
    });
    });
})};

const updateEmployeeRole = () => {
    var employeeSQL = `SELECT * FROM employee LEFT JOIN roles ON employee.role_id = roles.id`;
    db.query(employeeSQL, (err, response) => {
        var employeeList = [];
        response.forEach((employee) => {employeeList.push(`${employee.first_name} ${employee.last_name}`);});
        var rolesList = [];
        response.forEach((roles) => {rolesList.push(`${roles.title}`)});

        inquirer.prompt(
            [{
                type: 'list',
                name: 'employeeInput',
                message: 'Which employee would you like to update?',
                choices: employeeList
            },
            {
                type: 'list',
                name: 'roleUpdate',
                message: 'What is the new role of the employee?',
                choices: rolesList
            }]
        )
        .then((answer) => {

            var rolesID;
            response.forEach((roles) => {
                if (
                    answer.roleUpdate === roles.title
                ) {
                    rolesID = roles.id;
                }
            });
        
        

            var employeeId;
            response.forEach((employee) => {
                if (
                   answer.employeeInput === `${employee.first_name} ${employee.last_name}`
                ) {
                    employeeId = employee.id;
                }
            });
            const SQL = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
            const params = [rolesID, employeeId];
            db.query(SQL, params, function (err, results) {
                return questions();
            }
            );
            app.use((req, res) => {
                res.status(404).end();
            }
            );
        }
        );
    }
    );
}
