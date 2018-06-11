
/* Database set up scripts */
db.countries.insertMany([
	{ name: "India", iso: "IN", order: 1, is_active: true, phone_code: '91', phone_format: '9999999999', currency_code: 'INR', age_limit: { min: 14, max: 90 } },
	{ name: "USA", iso: "US", order: 2, is_active: true, phone_code: '1', phone_format: '999-999-9999', currency_code: 'USD', age_limit: { min: 14, max: 90 } },
	{ name: "Canada", iso: "CA", order: 3, is_active: true, phone_code: '1', phone_format: '999-999-9999', currency_code: 'CAD', age_limit: { min: 14, max: 90 } }
]);

db.countries.insertMany([
	{ reason: "Data Mismatch", code: "ECR1", state: 'false' },
	{ reason: "Document images are not clear", code: "ECR2", state: 'false' },
	{ reason: "Image holding document is not clear", code: "ECR3", state: 'false' },
	{ reason: "Invalid address proof", code: "ECR4", state: 'false' },
	{ reason: "Invalid identity proof", code: "ECR5", state: 'false' }
]);

db.configs.insertOne({
	approver_emails: ["gaurav@greenbankcapitalinc.com",
		"DW@greenbankcapitalinc.com",
		"Nilam@blockchainevolutioninc.com"]
});