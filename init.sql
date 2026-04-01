CREATE DATABASE bytenote;
use bytenote;

CREATE TABLE bn_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    permission ENUM('user', 'admin') DEFAULT 'user',
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bn_space (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descr TEXT,
    user_id INT NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES bn_user(id) ON DELETE CASCADE
);

CREATE TABLE bn_note (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    context TEXT,
    space_id INT NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (space_id) REFERENCES bn_space(id) ON DELETE CASCADE
);

CREATE TABLE bn_tag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES bn_user(id) ON DELETE CASCADE
);

CREATE TABLE bn_note_tag (
    note_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (note_id, tag_id), 
    FOREIGN KEY (note_id) REFERENCES bn_note(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES bn_tag(id) ON DELETE CASCADE
);

CREATE TABLE bn_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id iNT,
    action_event VARCHAR(100) NOT NULL,
    details JSON,
    execution_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES bn_user(id) ON DELETE SET NULL
);