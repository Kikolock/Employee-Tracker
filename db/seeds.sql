INSERT INTO department (department_name)
VALUES ("Engineering"), ("Finance"), ("Legal"), ("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 65000, 4),
("Sales Coordinator", 50000, 4),
("Lead Engineer", 95000, 1),
("Software Engineer", 60000, 1),
("Account Manager", 80000, 2),
("Accountant", 35000, 2),
("Legal Team Leader", 85000, 3),
("Lawyer", 50000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Icaro", "Araujo", 1, 1),
("Karen", "Almeida", 2, NULL),
("Jerry", "Lowis", 3, 3),
("Harry", "Maguire", 4, NULL),
("Neymar", "Junior", 5, 5),
("Peter", "Parker", 6, NULL),
("Kobe", "Bryant", 7, 7);