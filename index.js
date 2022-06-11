const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
            choices: ['View all employees', 'View all employees by department', 'View all employees by manager', 'Add employee', 'Remove Employee', 'Update employee role', 'Update employee manager', 'Exit']
        }
    )
    .then(({ type }) => {
        if (type === 'View all employees') {
            return viewEmployees();
        }else if (type === 'View all employees by department') {
            return viewEmployeesByDepartment();
        }else if (type === 'Exit') {
            return;
        }
    });
};
questions()

//render tables//

const viewEmployees = () => {

    //query the databases////
    db.query('SELECT * FROM roles', function (err, results) {
        console.table(results)
        return questions();
    });

    app.use((req, res) => {
        res.status(404).end();
    });
};

const viewEmployeesByDepartment = () => {

    //query the databases////
    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ('David ', 'Young', 2, 2)`, function (err, results) {
        return questions();
    });

    app.use((req, res) => {
        res.status(404).end();
    });
};
