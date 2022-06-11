INSERT INTO department (department_name)
Values 
("SALES"),
("HVAC"),
("QA"),
("WAREHOUSE"),
('PLUMBING');

INSERT INTO roles (title, salary, department_id)
Values 
("MANAGER", 50000, 1),
("TECH", 40000, 2),
("PURCHASER", 30000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
Values 
("John", "Doe", 1, 1),
("Jane", "Doe", 2, 2),
("Joe", "Doe", 3, 3);