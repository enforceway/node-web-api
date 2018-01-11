ALTER TABLE `hello_contact`.`contact_t` 
ADD COLUMN `address` VARCHAR(500) NULL AFTER `name`,
ADD COLUMN `email` VARCHAR(100) NULL AFTER `address`,
ADD COLUMN `birthday` DATE NULL AFTER `email`;
