const inquirer = require('inquirer');
const db = require('../db/connection.js');
const cTable = require('console.table');
const switchboard = require('../index.js');


function createDepartment() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Please enter the team department’s name?',
    }
  ])
  .then (name => {
    db.promise().query(
      'INSERT INTO department (name) VALUES (?)',
      [name])
    .then( ([rows,fields]) => {
      console.table(rows);
      switchboard();
    })
    
  });
};
        
function createRole(choicesArray) {       
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Please enter the role title?',

    },
    {
      type: 'input',
      name: 'salary',
      message: 'Please enter the salary?',
 
    },
    {
      type: 'list',
      name: 'department',
      message: 'Select Department:',
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
      message: 'Select Role:',
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
      message: 'Select Manager:',
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
    let departmentId = addData.department.slice((addData.department.indexOf("_")+1));
    let roleId = addData.role.slice((addData.role.indexOf("_")+1));
    let managerId = addData.manager.slice((addData.manager.indexOf("_")+1));
    db.promise().query(
      'INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)',
      [addData.first_name, addData.last_name, roleId, managerId]
    .then( ([rows,fields]) => {
      switchboard();
      })
    );
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
        result.push(rows[index].name.concat("_").concat(rows[index].id));
      }
      readManagers(result);
  });
};

function readEmployee() {
  sql = `SELECT employee.*,role.salary, role.title 
        AS role_title 
        FROM employee 
        LEFT JOIN role 
        ON employee.role_id = role.id`;
  db.promise().query(sql)
    .then(([rows,fields]) => {
    console.table(rows);
    switchboard();
  });
}

async function readDepartmentName() {
  result = [];
  sql = `SELECT department.name, department.id FROM department`;
  db.promise().query(sql)
    .then(([rows,fields]) => {
      var t = rows.length;
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
        WHERE role.title LIKE '%Lead'`;
  db.promise().query(sql)
    .then(([rows,fields]) => {
      for (let index = 0; index < rows.length; index++) {
        result.push(rows[index].name.concat("_").concat(rows[index].id));
      }
      createEmployee(roles,result);
  });
}


function updateDepartment(id,name) {
  sql = `UPDATE department
        SET name = ${name}
        WHERE department.id = ${id}`;
  db.execute(
    `UPDATE department
        SET name = ?
        WHERE department.id = ?`
    [name, id],
    function(err, results) {
      console.log(results);
    }
  );
};

function updateRole(id,salary) {
  db.execute(
    `UPDATE role
        SET salary = ?
        WHERE role.id = ?`
    [salary, id],
    function(err, results) {
      console.log(results);
    }
  );
};

function updateEmployee(id,mgrId) {
  db.execute(
    `UPDATE employee
        SET manager_id = ?
        WHERE employee.id = ?`
    [mgrId, id],
    function(err, results) {
      console.log(results);
    }
  );
}

function deleteDepartment(id) {
  db.execute(
    `DELETE FROM department
    WHERE department.id = ?`
    [id],
 
  );
};

function deleteRole(id) {
  db.execute(
    `DELETE FROM role
    WHERE role.id = ?`
    [id],
  );
};

function deleteEmployee(id) {
  db.execute(
    `DELETE FROM employee
    WHERE employee.id = ?`
    [id],
  );
}

function getDepartmentIdFromName(name) {
  sql = `SELECT department.id
        FROM department
        WHERE name = '${name}'`;
  db.promise().query(sql)
    .then(([rows,fields]) => {
      // console.log(rows);
console.log(rows);
      return (rows);
    });
};

function getRoleIdFromTitle(title) {
  sql = `SELECT role.id
        FROM role
        WHERE title = ${title}`;
  db.promise().query(sql)
    .then( ([rows,fields]) => {
      return rows;
    });
};

function getEmployeeIdFromName(name) {
  sql = `SELECT employee.id
        FROM employee
        WHERE last_name = ${name}`;
  db.promise().query(sql)
    .then( ([rows,fields]) => {
      return rows;
  });
};

module.exports = {
  createDepartment,
  createRole,
  createEmployee,

  readDepartment, readDepartmentName,
  readRole,readRoleTitle,
  readEmployee,readManagers,

  updateDepartment,
  updateRole,
  updateEmployee,

  deleteDepartment,
  deleteRole,
  deleteEmployee

};