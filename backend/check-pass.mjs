import bcrypt from 'bcryptjs';
const hash = '$2a$10$JtRu5y4JEo6h5CaW37c7xObq5t783kw84.3OdYJfcxRF94cViUOFm';
console.log('123456', await bcrypt.compare('123456', hash));
console.log('admin123', await bcrypt.compare('admin123', hash));
console.log('password', await bcrypt.compare('password', hash));
