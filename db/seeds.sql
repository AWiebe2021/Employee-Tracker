INSERT INTO department (name)
VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal');

INSERT INTO role (title,salary,department_id)
VALUES
  ('Sales Lead','100000','1'),
  ('Salesperson','80000','1'),
  ('Lead Engineer','150000','2'),
  ('Software Engineer','120000','2'),
  ('Accountant','125000','3'),
  ('Legal Team Lead','250000','4'),
  ('Lawyer','190000','4');


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Virginia', 'Woolf', '1', null),
  ('Piers', 'Gaveston', '2', '1'),
  ('Charles', 'LeRoi', '3', null),
  ('Katherine', 'Mansfield', '4', '3'),
  ('Dora', 'Carrington', '5', null),
  ('Edward', 'Bellamy', '6', null),
  ('Montague', 'Summers', '7', '6'),
  ('Octavia', 'Butler', '2', '1'),
  ('Unica', 'Zurn', '4', '3');


