const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

var result = [];

function switchboard() {
  console.log('');  
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'answer',
        message: 'Select Action:',
        choices: ['view all DEPARTMENTS', 'view all ROLES', 'view all EMPLOYEES', 'add a DEPARTMENT', 'add a ROLE', 'add an EMPLOYEE','update an EMPLOYEE ROLE?'],
      }
    ])
    .then(
      ({answer}) => {
      switch(answer) {
        case 'view all DEPARTMENTS':
           readDepartment();
          break;
        case 'view all ROLES':
          readRole();
          break;
        case 'view all EMPLOYEES':
          readEmployee();
          break;
        case 'add a DEPARTMENT':
          createDepartment();
          break;
        case 'add a ROLE':
          readDepartmentName();
          break;
        case 'add an EMPLOYEE':
          readRoleTitle()
          break;
        case 'update an EMPLOYEE ROLE?':
          readRoleTitleForUpdate();
          break;
      };
    
    })
};

console.log(' ______                 _                         _______             _         ');    
console.log('|  ____|               | |                       |__   __|           | |          ');  
console.log('| |__   _ __ ___  _ __ | | ___  _   _  ___  ___     | |_ __ __ _  ___| | _____ _ __ ');
console.log('|  __| |  _ ` _ \\|  _ \\| |/ _ \\| | | |/ _ \\/ _ \\    | |  __/ _` |/ __| |/ / _ \\  __|');
console.log('| |____| | | | | | |_) | | (_) | |_| |  __/  __/    | | | | (_| | (__|   <  __/ |   ');
console.log('|______|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|    |_|_|  \\__,_|\\___|_|\\_\\___|_|   ');
console.log('                 | |             __/ |                                              ');
console.log('                 |_|            |___/                                               ');

switchboard();

// -----------------------------------------

function createDepartment() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Please enter the DEPARTMENT NAME?',
    }
  ])
  .then (addData => {
    db.promise().query(
      'INSERT INTO department (name) VALUES (?)',
      [addData.name])
    .then( ([rows,fields]) => {
      switchboard();
    })
    
  });
};
        
function createRole(choicesArray) {       
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Please enter the ROLE TITLE?',

    },
    {
      type: 'input',
      name: 'salary',
      message: 'Please enter the SALARY?',
 
    },
    {
      type: 'list',
      name: 'department',
      message: 'Select DEPARTMENT:',
      choices: choicesArray,

    }
  ])
  .then (addData => {
    let departmentId = addData.department.slice((addData.department.indexOf("_")+1));
    db.promise().query(
      'INSERT INTO role (title,salary,department_id) VALUES (?,?,?)',
      [addData.title, addData.salary, departmentId])
    .then( ([rows,fields]) => {
      switchboard();
    });
  });
}

function createEmployee(roleArray,mngrArray) {       
  inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Please enter the FIRST NAME?',
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log('Please enter the FIRST NAME!');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Please enter the LAST NAME?',
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log('Please enter the LAST NAME!');
          return false;
        }
      }
    },
    {
      type: 'list',
      name: 'role',
      message: 'Select ROLE:',
      choices: roleArray,
      validate: switchInput => {
        if (switchInput) {
          return true;
        } else {
          console.log('Please select one!');
          return false;
        }
      }
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Select MANAGER:',
      choices: mngrArray,
      validate: switchInput => {
        if (switchInput) {
          return true;
        } else {
          console.log('Please select one!');
          return false;
        }
      }
    }
  ])
  .then (addData => {
    let roleId = addData.role.slice((addData.role.indexOf("_")+1));
    let managerId = addData.manager.slice((addData.manager.indexOf("_")+1));
    db.promise().query(
      'INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)',
      [addData.first_name, addData.last_name, roleId, managerId])
    .then( ([rows,fields]) => {
      switchboard();
      })
  });
}

function readDepartment() {
  sql = `SELECT *
        FROM department`;
  db.promise().query(sql)
    .then(([rows,fields]) => {
    console.table(rows);
    switchboard();
  });
};

function readRole() {
  sql = `SELECT role.id, role.title, role.salary
        FROM role`;
  db.promise().query(sql)
    .then(([rows,fields]) => {
    console.table(rows);
    switchboard();
  });
};

function readRoleTitle() {
  var result = [];
  sql = `SELECT role.title,role.id
        FROM role`;
  db.promise().query(sql)
    .then(([rows,fields]) => {
      for (let index = 0; index < rows.length; index++) {
        result.push(rows[index].title.concat("_").concat(rows[index].id));
      }
      readManagers(result);
  });
};

function readRoleTitleForUpdate() {
  var result = [];
  sql = `SELECT role.title,role.id
        FROM role`;
  db.promise().query(sql)
    .then(([rows,fields]) => {
      for (let index = 0; index < rows.length; index++) {
        result.push(rows[index].title.concat("_").concat(rows[index].id));
      }
      readEmployeeForUpdate(result);
  });
};

function readEmployee() {
  sql = `SELECT e.id,CONCAT(e.last_Name, ', ', e.first_Name) AS 'Employee', role.title AS Title, 
                department.name AS Department, role.salary, CONCAT(m.last_Name, ', ', m.first_Name) AS Manager
        FROM employee e
        LEFT JOIN role 
          ON e.role_id = role.id
        LEFT JOIN department 
          ON role.department_id = department.id
        LEFT JOIN employee m 
          ON m.id = e.manager_id`;

  db.promise().query(sql)
    .then(([rows,fields]) => {
    console.table(rows);
    switchboard();
  });
}

function readEmployeeForUpdate(roleArray) {
  sql = `SELECT employee.last_name,employee.id 
        FROM employee`;
  db.promise().query(sql)
    .then(([rows,fields]) => {
      for (let index = 0; index < rows.length; index++) {
        result.push(rows[index].last_name.concat("_").concat(rows[index].id));
      } 
    updateEmployee(roleArray,result);
  });
}

async function readDepartmentName() {
  result = [];
  sql = `SELECT department.name, department.id FROM department`;
  db.promise().query(sql)
    .then(([rows,fields]) => {
      for (let index = 0; index < rows.length; index++) {
        result.push(rows[index].name.concat("_").concat(rows[index].id));
      }
      createRole(result);
  });
 
};

function readManagers(roles) {
  var result = [];
  sql = `SELECT employee.last_name, employee.id 
        FROM employee
        JOIN role 
        ON employee.role_id = role.id
        WHERE role.title LIKE '%Lead%'`;
  db.promise().query(sql)
    .then(([rows,fields]) => {
      for (let index = 0; index < rows.length; index++) {
        result.push(rows[index].last_name.concat("_").concat(rows[index].id));
      }
      createEmployee(roles,result);
  });
}

function updateEmployee(roleArray,empArray) {
  inquirer.prompt([
    {
      type: 'list',
      name: 'employee',
      message: 'Select EMPLOYEE:',
      choices: empArray,
    },
    {
      type: 'list',
      name: 'role',
      message: 'Select NEW ROLE:',
      choices: roleArray,
    }
  ])
  .then (addData => {
    let roleId = addData.role.slice((addData.role.indexOf("_")+1));
    let empId = addData.employee.slice((addData.employee.indexOf("_")+1));
    db.promise().query(`UPDATE employee
                          SET role_Id = ${roleId}
                          WHERE id = ${empId}`
                      )
                .then( ([rows,fields]) => {
                  switchboard();
                  })
  });
};

// module.exports = {
// switchboard
// };