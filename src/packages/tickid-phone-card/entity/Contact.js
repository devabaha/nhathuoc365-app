import vi2en from '../helper/vi2en';
import replaceAll from '../helper/replaceAll';

class Contact {
  constructor(data) {
    this.data = data;
  }

  get id() {
    return this.data.recordID;
  }

  get name() {
    const { familyName, givenName } = this.data;
    return `${familyName ? `${familyName} ` : ''}${givenName}`;
  }

  get nameEn() {
    return vi2en(this.name);
  }

  get phone() {
    return this.data.phoneNumbers[0] ? this.data.phoneNumbers[0].number : '';
  }

  get newPhone() {
    let newNumber = replaceAll(this.phone, '+84', '0');
    if (newNumber.slice(0, 2) === '84') {
      newNumber = newNumber.replace('84', '0');
    }
    return newNumber;
  }

  get displayPhone() {
    const phone = replaceAll(this.newPhone.toLowerCase(), ' ', '');
    const phoneArr = phone.split('');
    if (phone.length === 10) {
      phoneArr.splice(3, 0, ' ');
      phoneArr.splice(7, 0, ' ');
    } else {
      phoneArr.splice(4, 0, ' ');
      phoneArr.splice(8, 0, ' ');
    }
    return phoneArr.join('');
  }

  isMatch = searchText => {
    const newSearchText = replaceAll(searchText.toLowerCase(), ' ', '');
    const nameNoSpace = replaceAll(this.name.toLowerCase(), ' ', '');
    return (
      nameNoSpace.includes(newSearchText) ||
      replaceAll(this.nameEn.toLowerCase(), ' ', '').includes(newSearchText) ||
      replaceAll(this.phone.toLowerCase(), ' ', '').includes(newSearchText) ||
      replaceAll(this.newPhone.toLowerCase(), ' ', '').includes(newSearchText)
    );
  };
}

export default Contact;
