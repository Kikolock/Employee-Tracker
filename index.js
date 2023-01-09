const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

require(`dotenv`).config();

// Start SQL Connection
const db = mysql.createConnection({
  host: `localhost`,
  user: `root`,
  password: process.env.DB_PASSWORD,
  database: `employee_db`,
});

// Start Main menu
db.connect(function () {
    console.log(`Connection successful to employee_db database`);
    mainMenu();
  });

//ASCII title screen
const titleScreen = () => {
    console.log(`
      ███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗
      ██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝
      █████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗  
      ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝  
      ███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗
      ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝
                                                                           
      ███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗██████╗        
      ████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗       
      ██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██████╔╝       
      ██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██╔══██╗       
      ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║  ██║       
      ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝       
                                                                           `);
  }

// Main menu functions will be called depending on user input information
const mainMenu = () => {
  return inquirer
   .prompt([
      {
        type: 'list',
        name:'mainMenu',
        message: 'What would you like to do?',
        choices: [
          'View All Employees',
          'View All Roles',
          'View All Departments',
          'Add an Employee',
          'Add a new Role',
          'Add a new Department',
          'Update an Employee Role',
          'Delete an Employee',
          'Delete a Role',
          'Delete a Department',
          'View employee by department',
          'View employee by role',
          'View employee by manager',
          "View a department's utilized budget",
          'Exit',
        ],
      },
   ])
   .then((userInput) => {
    console.log(`Action Selected: ${userInput.mainMenu}`);


    switch (userInput.mainMenu) {

        case 'View All Employees':
        viewAllEmployees();
        break;
        case 'View All Roles':
        viewAllRoles();
        break;
        case 'View All Departments':
        viewAllDepartments();
        break;
        case 'Add an Employee':
        addEmployee();
        break;
        case 'Add a new Role':
        addANewRole();
        break;
        case 'Add a new Department':
        addANewDepartment();
        break;
        case 'Update an Employee Role':
        updateAnEmployeeRole();
        break;
        case 'Update an employee Manager':
        updateManager();
        break;
        case 'Delete an Employee':
        deleteAnEmployee();
        break;
        case 'Delete a Role':
        deleteARole();
        break;
        case 'Delete a Department':
        deleteADepartment();
        break;
        case 'View Employee by department':
        viewEmployeeByDepartment();
        break;
        case 'View employee by role':
        viewEmployeeByRole();
        break;
        case 'View Employee by manager':
        viewEmployeeByManager();
        break;
        case "View a department's utilized budget":
        viewDepartmentUtilizedBudget();
        break;
        case 'Exit':
            db.end();
            break;
    }
});
};

// View Functions
const viewAllEmployees = () => {
    db.query(`SELECT * FROM employee`, (err, results) => {
        if  (err) throw err;
        console.table(results);
        mainMenu();
    });
};

const viewAllRoles = () => {
    db.query(`SELECT * FROM roles`, (err, results) => {
        if  (err) throw err;
        console.table(results);
        mainMenu();
    });
};

const viewAllDepartments = () => {
    db.query(`SELECT * FROM department`, (err, results) => {
        if  (err) throw err;
        console.table(results);
        mainMenu();
    });
};

// Add a new department to table
const addANewDepartment = () => {
    return inquirer
   .prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the new department?',
            validate: (userInput) => {
                if (userInput)  {
                return true;
            } else {
                console.log('Please enter a department name');
                return false;
            }
        },
    },
])
   .then(({departmentName}) => {
    db.query(`INSERT INTO department(department_name) VALUES(?)`, departmentName,
    function (err, results) {
        if (err) throw err;
        console.log(results);
        viewAllDepartments();
    });
});
};

// Add a new role to table
const addANewRole = () => {
    return inquirer
  .prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: 'What is the title of the new role?',
            validate: (userInput) => {
                if (userInput)  {
                return true;
                } else {
                console.log('Please enter a role title');
                return false;
                }
            },
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary of the new role?',
            validate: (userInput) => {
                if (userInput)  {
                return true;
                } else {
                console.log('Please enter a role salary');
                return false;
                }
            },
        },
    ])
    .then(({ roleTittle,roleSalary }) => {
        const newRoleTittle = [roleTittle, roleSalary];
        db.query(`SELECT * FROM department`, (err, results) => {
            const departmentChoices = [];
            results.forEach(({department_name, id}) => {
                departmentChoices.push({
                    name: department_name,
                    value: id,
                });
            });

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department does this role belong to?',
                    choices: departmentChoices,
                },
            ])
            .then(({ department }) => {
                newRoleTittle.push(department);
                db.query(`INSERT INTO roles(title,salary,department_id) VALUES(?,?,?)`,
                newRoleTittle,
                (err, results) => {
                    if (err) throw err;
                    console.table(results);
                    viewAllRoles();
                });
            });
        });
    });
};

// Add a new employee to table
const addEmployee = () => {

    return inquirer
    .prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
            validate: (userInput) => {
                if (userInput)  {
                return true;
                } else {
                    console.log("Please enter the employee's first name");
                    return false;
                }
            },
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: (userInput) => {
                if (userInput)  {
                return true;
                } else {
                    console.log("Please enter the employee's last name");
                    return false;
                }
            },
        },
    ]).then(({ firstName, lastName }) => {
        const newEmployee = [firstName, lastName];
        console.log(newEmployee);
        db.query(`SELECT * FROM roles`, (err, results) => {
            if (err) throw err;
            console.log(results);
            const rolesChoises = [];
            results.forEach(({ title, id }) => {
                rolesChoises.push({
                    name: title,
                    value: id,
                });
            });

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: rolesChoises,
                },
            ])
            .then(({ role }) => {

                newEmployee.push(role);
                console.log(newEmployee);

                db.query(`SELECT * FROM employee`, (err, results) => {
                    if (err) throw err;
                    
                    const managerList = [
                        {
                            name: "None",
                            value: null,
                        },
                    ];
                    results.forEach(({ id, first_name, last_name }) => {
                        managerList.push({
                            name: `${first_name} ${last_name}`,
                            value: id,
                        });
                    });

                    inquirer.prompt([
                        {
                            type: 'list',
                            name:'manager',
                            message: "Who is the employee's manager?",
                            choices: managerList,
                        },
                    ])
                    .then(({ manager }) => {
                        
                        newEmployee.push(manager);
                        db.query(
                            `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
                            newEmployee,
                            (err, results) => {
                                if (err) throw err;
                                console.table(results);
                                console.log("Employee successfully added!");
                                viewAllEmployees();
                            });
                        });
                    });
                });
            });
        });
 };

 // Update roles
 const updateAnEmployeeRole = () => {
    db.query(`SELECT * FROM employee`, (err, results) => {
        if (err) throw err;
        const employeeList = [];
        results.forEach(({ id, first_name, last_name }) => {
            employeeList.push({
                name: `${first_name} ${last_name}`,
                value: id,
            });
        });
        
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Which employee would you like to update?",
                choices: employeeList,
            },
        ])
        .then(({ employee }) => {
            let employeeId = employee;
            db.query(`SELECT * FROM roles`, (err, results) => {
                if (err) throw err;
                const rolesChoises = [];
                results.forEach(({ title, id }) => {

                    rolesChoises.push({
                        name: title,
                        value: id,
                    });
                });
                
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's new role?",
                        choices: rolesChoises,
                    },
                ])
                .then(({ role }) => {
                    db.query(`UPDATE employee SET role_id = ${role} WHERE id=${employeeId}`,
                    (err, results) => {
                        console.log(results);
                        viewAllEmployees();
                    });
                });
            });
        });
    });
};

// Update manager
const updateManager = () => {
    db.query(`SELECT * FROM employee`, (err, results) => {
        if (err) throw err;
        const employeeList = [];
        results.forEach(({ id, first_name, last_name }) => {

            employeeList.push({
                name: `${first_name} ${last_name}`,
                value: id,
            });
        });
        const managerList = [
            {
                name: "None",
                value: null,
            },
        ];
        results.forEach(({ id, first_name, last_name }) => {

            managerList.push({
                name: `${first_name} ${last_name}`,
                value: id,
            });
        });

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Which employee would you like to update?",
                choices: employeeList,
            },
           {
                type: 'list',
                name:'manager',
                message: "Who is the employee's new manager?",
                choices: managerList,
           },
        ]).then(({ employee, manager }) => {
            let employeeId = employee;
            let managerId = manager;
            db.query(`UPDATE employee SET manager_id=${managerId} WHere id=${employeeId}`,
            (err, results) => {
                if (err) throw err;
                console.log(results);
                viewAllEmployees();
            });
        });
    });
};

// Displays all employees and their department
const viewEmployeeByDepartment = () => {
    db.query(`SELECT d.department AS 'Department', e.last_name AS 'Last Name', e.first_name AS 'First Name', r.title AS 'Role' FROM employee e JOIN roles r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    ORDER BY d.department_name, e.last_name`,

    (err, results) => {
        if (err) throw err;

        console.table(results);
        mainMenu();
    });
};

// Displays all employees and their managers
const viewEmployeeByManager = () => {
    db.query(`SELECT e.first_name AS 'Employee First Name', e.last_name AS 'Employee Last Name,
    m.first_name AS 'Manager First Name', m.last_name AS 'Manager Last Name'
    FROM employee e
    LEFT JOIN employee m ON e.manager_id = m.id
    ORDER BY m.last_name, e.first_name`,

    (err, results) => {
        if (err) throw err;
        console.table(results);
        mainMenu();
    });
};

titleScreen();
