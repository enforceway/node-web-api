ALTER TABLE `hello_contact`.`contact_t` 
ADD COLUMN `address` VARCHAR(500) NULL AFTER `name`,
ADD COLUMN `email` VARCHAR(100) NULL AFTER `address`,
ADD COLUMN `birthday` DATE NULL AFTER `email`;
ADD COLUMN `description` VARCHAR(500) NULL AFTER `birthday`;

ALTER TABLE `hello_contact`.`favorite_contact_t` 
ADD COLUMN `if_like` INT NOT NULL AFTER `contact_id`;
