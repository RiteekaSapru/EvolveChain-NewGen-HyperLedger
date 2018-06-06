
/* Database set up scripts */
db.countries.insertMany([
    { name: "India", iso: "IN", order: 1, is_active: true, phone_code: '91', phone_format:'9999999999', currency_code:'INR', age_limit:{min:14, max:90} },
    { name: "USA", iso: "US", order: 2, is_active: true, phone_code: '1', phone_format:'999-999-9999', currency_code:'USD' ,age_limit:{min:14, max:90} },
    { name: "Canada", iso: "CA", order: 3, is_active: true, phone_code: '1', phone_format:'999-999-9999', currency_code:'CAD',age_limit:{min:14, max:90}  }
]);