DROP DATABASE IF EXISTS staff_db;
CREATE DATABASE staff_db;

USE staff_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(40),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE SET NULL
);

 employee (
  id  AUTO_INCREMENT ,
  first_name (40),
  last_name(40),
  role_id ,
  manager_id ,
  REFERENCES employee(id)
  FOREIGN KEY (job_id)
  FOREIGN KEY (manager_id)
  REFERENCES job(id)
  ON DELETE SET ,
  ON DELETE SET
);
