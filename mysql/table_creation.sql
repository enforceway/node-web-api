CREATE TABLE `hello_contact`.`contact_t` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mobile_number` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE `hello_contact`.`favorite_contact_t` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `contact_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `contact_id_idx` (`contact_id` ASC),
  CONSTRAINT `contact_id`
    FOREIGN KEY (`contact_id`)
    REFERENCES `hello_contact`.`contact_t` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
