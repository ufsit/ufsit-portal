/*
Field		Type		Null	Key	Default	Extra
id		int(11)		NO	PRI	NULL	auto_increment
full_name	varchar(100)	NO		NULL
email		varchar(254)	NO		NULL
verification_level	int(11)	NO		0
permissions	text		NO		NULL
password	varchar(200)	NO		NULL
registration_ip	varchar(40)	NO		NULL
registration_date	datetime	NO		NULL
last_visit	datetime	YES		NULL
mass_mail_optin	int(1)		NO		NULL
grad_date	varchar(50)	NO		NULL
rank		int(11)		YES	MUL	NULL

Field		Type		Null	Key	Default	Extra
email		varchar(100)	NO		NULL
password_salt	varchar(100)	YES		NULL
password_hash	varchar(100)	YES		NULL
full_name	varchar(100)	YES		NULL
in_mailing_list	varchar(100)	YES		NULL
grad_year	varchar(100)	YES		NULL
*/

-- `registration_date` Default to the day we launched the web app
-- Note that we are changing the password format
-- Registration IP is just going to have to be lost :(
-- Permissions are set to nothing for now
INSERT INTO account (`full_name`, `email`, `password`,
  `mass_mail_optin`, `grad_date`,
  `permissions`, `registration_ip`, `registration_date`)
SELECT `full_name`, `email`, CONCAT(`password_salt`, "$", `password_hash`),
  `in_mailing_list`, `grad_year`,
  "", "", "2017-9-21 17:30:00"
FROM accounts_old;
