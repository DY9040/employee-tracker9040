DROP DATABASE IF EXISTS my_team_db;
CREATE DATABASE my_team_db;

USE my_team_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(20) NOT NULL
    );

    CREATE TABLE roles (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(20) NOT NULL,
        salary DECIMAL NOT NULL,
        department_id INT
        FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
        );

        CREATE TABLE employee (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(20) NOT NULL,
            last_name VARCHAR(20) NOT NULL,
            role_id INT,
            manager_id INT,
            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
        );