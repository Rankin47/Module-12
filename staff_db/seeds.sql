department(name)
VALUES ("Manager"), ("Marketer"), ("Salesman"), ("Lawyer"), ("Technition");


(title, salary, department_id)
VALUES ("Operations Manager",210000, 1),
    ("Associate",57000, 1),
    ("Marketing Manager",215000, 2),
    ("Salesman",80000, 3),
    ("Lawyer",170000, 4),
    ("Developer",531000, 5),
    ("Intern",58000, 7),
    ("DevOps",210000, 6);


 employee (first_name, last_name, job_id, manager_id)
VALUES ("Jim", "Smith", 1, null),
    ("Lisa", "Fisher", 4, null),
    ("John", "Wurtle", 1, 5),
    ("Homer", "Carter", 3, 2),
    ("Sally", "Morris", 4, 4),
    ("Brian", "Smart", 3, 1);


CREATE VIEW employee_info AS
(SELECT
job.id AS job_id,
job.title,
job.salary,
department.name AS department_name
FROM job
JOIN department 
on job.department_id = department.id);

create VIEW employees_with_managers AS
(SELECT emp.id,
emp.job_id,
emp.first_name,
emp.last_name,

CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
FROM employee AS manager RIGHT OUTER JOIN employee AS emp ON manager.id = emp.manager_id);