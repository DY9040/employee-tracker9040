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
    db.query('SELECT * FROM roles', function (err, results) {
        console.table(results)
        return questions();
    });
    app.use((req, res) => {
        res.status(404).end();
    });
};

const viewEmployees = () => {

    db.query('SELECT * FROM employee', function (err, results) {
        console.table(results)
        return questions();
    });
    app.use((req, res) => {
        res.status(404).end();
    });
};

const addDepartment = () => {
      //query the databases////
      db.query(`INSERT INTO department (department_name)
      VALUES ('Technical')`, function (err, results) {
          return questions();
      });
  
      app.use((req, res) => {
          res.status(404).end();
      });
};

const addRole = () => {
    //query the databases////
    db.query(`INSERT INTO roles (title, salary, department_id)
    VALUES ('Purchaser, 30000 2')`, function (err, results) {
        return questions();
    });

    app.use((req, res) => {
        res.status(404).end();
    });
};

const addEmployee = () => {
    //query the databases////
    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ('David', 'Young', 3, 2)`, function (err, results) {
        return questions();
    });

    app.use((req, res) => {
        res.status(404).end();
    });
};