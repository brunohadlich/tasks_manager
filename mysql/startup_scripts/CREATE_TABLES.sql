CREATE TABLE users (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(150) NOT NULL UNIQUE KEY,
	role TEXT NOT NULL
);

CREATE TABLE tasks (
	id INT PRIMARY KEY AUTO_INCREMENT,
	summary VARCHAR(2500) NOT NULL,
	date DATETIME NOT NULL,
	user_id INT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id)
);

insert into users(name, role) values('Joao', 'Manager');
insert into users(name, role) values('Joaquim', 'Technician');
insert into users(name, role) values('Pedro', 'Technician');