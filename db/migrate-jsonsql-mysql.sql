-- Migrations from JsonSQL to new schema

DROP TABLE sessions;
ALTER TABLE accounts RENAME TO accounts_old;
ALTER TABLE event_sign_ins RENAME TO event_sign_ins_old;

-- `registration_date` Default to the day we launched the web app
-- Note that we are changing the password format
-- Registration IP is just going to have to be lost :(
-- Permissions are set to nothing for now
INSERT INTO account (`full_name`, `email`, `ufl_email`, `password`,
  `mass_mail_optin`, `grad_date`,
  `permissions`, `registration_ip`, `registration_date`)
SELECT `full_name`, `email`, CONCAT(`password_salt`, "$", `password_hash`),
  `in_mailing_list`, `grad_year`,
  "", "", "2017-9-21 17:30:00"
FROM accounts_old;
