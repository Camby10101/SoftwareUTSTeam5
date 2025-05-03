const fs = require('fs');

class Customer {
    constructor(name, email, password, phoneNumber) {
      this.name = name;
      this.email = email;
      this.password = password;
      this.phoneNumber = phoneNumber;
    }
  
    getName() {
      return this.name;
    }
  
    getEmail() {
      return this.email;
    }

    getPassword() {
      return this.password;
    }
  
    getPhoneNumber() {
      return this.phoneNumber;
    }
  
    setName(name) {
      this.name = name;
    }
  
    setEmail(email) {
      this.email = email;
    }

    setPassword(password) {
      this.password = password;
    }
  
    setPhoneNumber(phoneNumber) {
      this.phoneNumber = phoneNumber;
    }

    toJSON() {
        return {
          name: this.name,
          email: this.email,
          password: this.password,
          phoneNumber: this.phoneNumber
        };
    }
    
    saveToFile(filePath = 'customers.json') {
        const data = JSON.stringify(this.toJSON(), null, 2);
    
        fs.appendFile(filePath, data + ',\n', (err) => {
          if (err) {
            console.error('Failed to save customer:', err);
          } else {
            console.log('Customer saved successfully.');
          }
        });
    }

    static loadAllFromFile(filePath = 'customers.json') {
        const fs = require('fs');
      
        try {
          const data = fs.readFileSync(filePath, 'utf8');
          const customerArray = JSON.parse(data);
      
          return customerArray.map(c => new Customer(c.name, c.email, c.password, c.phoneNumber));
        } catch (err) {
          console.error("Error loading customers:", err);
          return [];
        }
    }
}
  