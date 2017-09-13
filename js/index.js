    let doc = window.document;
    let add = document.getElementById('add');
    let parent_block = doc.getElementById('parent_block');
    let main_block = doc.getElementById('main_block');
    let header = doc.getElementById('header');
    let search = doc.getElementById('search');
    let somePhoneNumerator = 1;
    let someMailNumerator = 1;
    let mailCorrect = true;
    let permissionToNewMailInput = false;
    let popupSave = doc.getElementById('saveComplete');
    let popupRemove = doc.getElementById('removeComplete');
    let prevention = doc.getElementById('prevention');

    //  ЗАГРУЗКА СПИСКА ИЗ localStorage ----------------------------------------------
    var control = JSON.parse(localStorage.getItem('controlKey'));
    // console.log(control.length);
    // window.onload = start();
    let start = function () {
        if (control !== null) {
         for ( let i = 0; i<control.length; i++) {
                let tmpi = control[i];
                let addNewContact = doc.createElement('div');
                addNewContact.id = i;
                addNewContact.className = 'my-message my-message-title';
                // addNewContact.innerHTML = '<div class="my-message"><p class="my-message-title">'+tmpi.lastname +' '+ tmpi.name +'</p></div>';
                addNewContact.innerHTML = tmpi.lastname +' '+ tmpi.name;
                parent_block.appendChild(addNewContact);
            }
        } else {
            control = [];
        }
    };
    start();

    //ДЕЙСТВИЯ ПО КНОПКЕ "ADD"--------------------------------------------------------
    //СОЗДАНИЕ МАКЕТА
    let addNewContact = function () {
        // console.log(add.id);
        let backing = doc.createElement('div');
        backing.innerHTML = '<div class="backing clearfix" id="backing"></div>'
        main_block.appendChild(backing);

        let contactProfile = doc.createElement('div');
        contactProfile.innerHTML = '<div class="main_new_contact_block clearfix" id="newContact">\
                <div class="Del_Close_Save clearfix">\
                    <button class="save" type="button" id="save">Save <i class="fa fa-check" aria-hidden="true"></i></button>\
                    <button class="close" type="button" id="close">Cancel <i class="fa fa-times" aria-hidden="true"></i></button>\
                </div>\
                <div class="clearfix">\
                    <input required placeholder="Name" class="input_zone" id="name" autofocus oninput="this.value=this.value.replace(/[^\\qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM]/ig, \'\')">\
                    <input required placeholder="Lastname" class="input_zone" id="lastname" oninput="this.value=this.value.replace(/[^\\qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM]/ig, \'\')">\
                </div>\
                <div class="clearfix" id="inputPhone">\
                    <input type="tel" oninput="this.value = this.value.replace (/\\D/, \'\')" name="phone" class="input_zone" placeholder="Phone" id="phone1">\
                    <button class="new_phone_mail" type="button" id="addPhone">+</button>\
                    <button class="new_phone_mail" type="button" id="removePhone">-</button>\
                </div>\
                <div class="clearfix" id="inputMail">\
                    <input type="email" name="mail" class="input_zone" placeholder="Mail" id="mail1">\
                    <button class="new_phone_mail" type="button" id="addMail">+</button>\
                    <button class="new_phone_mail" type="button" id="removeMail">-</button>\
                </div>\
            </div>';
        header.appendChild(contactProfile);

        //CLOSE
        let close = doc.getElementById('close');
        close.addEventListener('click', closeContact);

        //SAVE
        let save = doc.getElementById('save');
        save.addEventListener('click', saveNewContact);

        //Действия кнопки [+] Phone
        let addPhone = doc.getElementById('addPhone');
        let inputPhone = doc.getElementById('inputPhone');
        addPhone.addEventListener('click', addnewphone);

        //Действия кнопки [-] Phone
        let removePhone = doc.getElementById('removePhone');
        removePhone.addEventListener('click', removenewphone);

        //Действия кнопки [+] Mail
        let addMail = doc.getElementById('addMail');
        let inputMail = doc.getElementById('inputMail');
        addMail.addEventListener('click', addnewmail);

        //Действия кнопки [-] Mail
        let removeMail = doc.getElementById('removeMail');
        removeMail.addEventListener('click', removenewmail);

        //Валидация Mail input
        inputMail.addEventListener('input', mailValidation);

        //Подсказка на Name
        let nameZone = doc.getElementById('name');
        nameZone.addEventListener('input', hintName);

        //Подсказка на Lastname
        let lastnameZone = doc.getElementById('lastname');
        lastnameZone.addEventListener('input', hintLastname);

        //Подсказка на Phone
        let phoneZone = doc.getElementById('phone1');
        phoneZone.addEventListener('input', hintPhone);
    };
     add.addEventListener('click', addNewContact);

    //SAVE button
    let saveNewContact = function () {
        let name = document.getElementById("name").value;
        let lastname = document.getElementById("lastname").value;
        let phone = document.getElementById("phone1").value;
        let mail = document.getElementById("mail1").value;


        let tmparr = { name: name,
            lastname: lastname,
            phone: [phone],
            mail: [mail]
        };

        if (somePhoneNumerator !== 1) {
            for (let j=2; j<=somePhoneNumerator; j++) {
                let tmpArrPhone = doc.getElementById("phone" + j).value;
                if (tmpArrPhone.length > 2) {
                    tmparr.phone.push(tmpArrPhone);
                }
            }
        }
        somePhoneNumerator = 1;

        if (someMailNumerator !== 1) {
            for (let m=2; m<=someMailNumerator; m++) {
                let tmpArrMail = doc.getElementById("mail" + m).value;
                if (tmpArrMail !== '') {
                    tmparr.mail.push(tmpArrMail);
                }
            }
        }
        someMailNumerator = 1;

        //Условие на пропуск первого поля mail
        if (tmparr.mail.length != 1 && tmparr.mail[0] == '') {
            tmparr.mail.shift();
        }

        //Условия на заполнение полей
        let contactValidation = 1;
        if (control.length !== 0){
            for (var i = 0; i<control.length; i++) {
                let tmpContactData = control[i].name.toLowerCase() +' '+ control[i].lastname.toLowerCase();
                let tmpContactValue = tmparr.name.toLowerCase() +' '+ tmparr.lastname.toLowerCase();
                    if (tmpContactData === tmpContactValue) {
                        contactValidation = 0;
                    } else {
                        Prevention();
                    }
            }
        }

        if (name.length >=2 && lastname.length >=2 && phone.length >= 3 && contactValidation !== 0 && mailCorrect === true) {
            if (control !== null){
                control.push(tmparr);
            }
            localStorage.setItem('controlKey', JSON.stringify(control));

            //Запись нового контакта в тело документа
            var addNewContact = doc.createElement('div');
            // console.log(tmpCK);
            if (control == null){
                // addNewContact.id = control.length-1;
                addNewContact.id = 0;
            } else {
                // addNewContact.id = 0;
                addNewContact.id = control.length-1;
            }
            addNewContact.innerHTML = '<div class="my-message"><span class="my-message-title">'+tmparr.lastname +' '+ tmparr.name +'</span></div>';
            parent_block.appendChild(addNewContact);

            // if (control.length >= 1){
            refreshContact();
            // }
            closeContact();
            popupSaveComplete();
        }
    };

    //Popup savedComplete
    function popupSaveComplete() {
        setTimeout(function() {popupSave.style.display = 'block';}, 100);
        setTimeout(function() {popupSave.style.display = 'none';}, 2000);
    }
    //Popup removeComplete
    function popupRemoveComplete() {
        setTimeout(function() {popupRemove.style.display = 'block';}, 100);
        setTimeout(function() {popupRemove.style.display = 'none';}, 2000);
    }
    //Popup Prevention
    function Prevention() {
        setTimeout(function() {prevention.style.display = 'block';}, 100);
        setTimeout(function() {prevention.style.display = 'none';}, 2000);
    }

    //Действия кнопки [+] Phone
    let addnewphone = function () {
        if (doc.getElementById("phone" + somePhoneNumerator).value.length > 2) {
            somePhoneNumerator++;
            let somePhone = "phone" + somePhoneNumerator;
            console.log(somePhone);

            let newInput = doc.createElement('input');
            newInput.id = somePhone;
            newInput.placeholder = "Phone" + somePhoneNumerator;
            newInput.className = 'input_zone';
            newInput.oninput = function () {this.value = this.value.replace (/\D/, '')};
            newInput.innerHTML = '<input type="tel" name="phone">';
            inputPhone.appendChild(newInput);
        }
    };

    //Действия кнопки [-] Phone
    let removenewphone = function () {
        if (somePhoneNumerator>1){
            let tmpRemovePhone = doc.getElementById("phone"+somePhoneNumerator);
            tmpRemovePhone.remove();
            somePhoneNumerator--;
        }
    };

    //Действия кнопки [+] Mail
    let addnewmail = function () {
        if (permissionToNewMailInput === true) {
            someMailNumerator++;
            let someMail = "mail" + someMailNumerator;
            let readOnlyMail = "mail" + (someMailNumerator-1);
            // console.log(readOnlyMail);
            document.getElementById(readOnlyMail).setAttribute("readOnly","readOnly");
            mail = doc.getElementById('mail' + someMailNumerator);
            // console.log(someMail);

            let newInput = doc.createElement('input');
            newInput.id = someMail;
            newInput.placeholder = someMail;
            newInput.className = 'input_zone';
            newInput.setAttribute('input', mailValidation);
            newInput.innerHTML = '<input type="email" name="mail">';
            inputMail.appendChild(newInput);
        }
    };

    //Действия кнопки [-] Mail
    let removenewmail = function () {
        if (someMailNumerator>1){
            // console.log(someMailNumerator);
            let tmpRemoveMail = doc.getElementById("mail"+someMailNumerator);
            tmpRemoveMail.remove();
            someMailNumerator--;
        } else {
            doc.getElementById('mail1').readOnly = false;
        }
    };

    //Перезалив контактов refreshContact
    let refreshContact = function () {
            for (var x=0; x<control.length; x++) {
                // console.log(control.length, x);
                parent_block.removeChild(doc.getElementById(x));
            }
        start();
    };

    //ВАЛИДАЦИЯ ПОЛЯ MAIL

    let mailValidation = function (e) {
        var e = e || event;
        var target = e.target || e.srcElement;
        tmpMailID = target.id;
        let mail = doc.getElementById(tmpMailID);
        // console.log(tmpMailID);
        // console.log(mail.value);

            if (mail.value.indexOf('@') >= 0 && mail.value.indexOf('.') > mail.value.indexOf('@') +1 && mail.value.length > mail.value.indexOf('.') +2) {
                mailCorrect = true;
                permissionToNewMailInput = true;
                doc.getElementById('mail' + someMailNumerator).style.backgroundColor = '#97d696';
            } else if (mail.value == '') {
                mailCorrect = true;
                permissionToNewMailInput = false;
                doc.getElementById('mail' + someMailNumerator).style.backgroundColor = 'white';
            } else {
                mailCorrect = false;
                permissionToNewMailInput = false;
                doc.getElementById('mail' + someMailNumerator).style.backgroundColor = '#f1bdbd';
            }
    };

    //Подсказка на Name, Lastname, Phone
    let hintName = function () {
        // console.log('test');
        let name = doc.getElementById('name');
        if (name.value.length >= 2){
            name.style.backgroundColor = '#97D696'
        } else {
            name.style.backgroundColor = '#f1bdbd'
        }
    };
    let hintLastname = function () {
        let lastname = doc.getElementById('lastname');
        if (lastname.value.length >= 2){
            lastname.style.backgroundColor = '#97D696'
        } else {
            lastname.style.backgroundColor = '#f1bdbd'
        }
    };
    let hintPhone = function () {
        // let phone = doc.getElementById('phone' + somePhoneNumerator);
        let phone = doc.getElementById('phone1');
        console.log('phone' + somePhoneNumerator);
        if (phone.value.length > 2){
            phone.style.backgroundColor = '#97D696'
        } else {
            phone.style.backgroundColor = '#f1bdbd'
        }
    };

////////////////////////ДЕЙСТВИЯ ПО НАЖАТИЮ НА КОНТАКТ/////////////////////////////
    let contactListID = doc.getElementById('parent_block');
    let showContact = function (e) {

        var e = e || event;
        var target = e.target || e.srcElement;
        tmpID = target.id;
        // console.log(tmpID);

        let tmpArrReCall = control[tmpID];
        // console.log(tmpArrReCall);
        // console.log('test');

        //СТРОИМ конструкцию под tmpArrReCall
        let backing = doc.createElement('div');
        backing.innerHTML = '<div class="backing clearfix" id="backing"></div>'
        main_block.appendChild(backing);

        var contactProfileButtonZone = doc.createElement('div');
        contactProfileButtonZone.innerHTML = '<div class="main_new_contact_block clearfix" id="newContact">\
                <div class="Del_Close_Save clearfix">\
                    <button class="del" type="button" id="del"><i class="fa fa-trash-o" aria-hidden="true" style="font-size: 30px; color: red"></i></button>\
                    <button class="save" type="button" id="save">Save <i class="fa fa-check" aria-hidden="true"></i></button>\
                    <button class="close" type="button" id="close">Cancel <i class="fa fa-times" aria-hidden="true"></i></button>\
                </div>\
                <div class="clearfix" id="nameZone">\
                </div>\
                <div class="clearfix" id="inputPhone">\
                </div>\
                <div class="clearfix" id="inputMail">\
                </div>\
                </div>';
        header.appendChild(contactProfileButtonZone);

        //NameZone
        var nameZone = doc.getElementById('nameZone');
        var contactProfileNameZone = doc.createElement('input');
        contactProfileNameZone.value = tmpArrReCall.name;
        contactProfileNameZone.className = 'input_zone';
        contactProfileNameZone.id = 'name';
        contactProfileNameZone.placeholder = 'Name';
        contactProfileNameZone.style.backgroundColor = '#97d696';
        contactProfileNameZone.oninput = function () {this.value=this.value.replace(/[^\qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM]/ig, '')};
        contactProfileNameZone.innerHTML = '<input>';
        nameZone.appendChild(contactProfileNameZone);

        //LastnameZone
        var lastnameZone = doc.getElementById('nameZone');
        var contactProfileLastnameZone = doc.createElement('input');
        contactProfileLastnameZone.value = tmpArrReCall.lastname;
        contactProfileLastnameZone.className = 'input_zone';
        contactProfileLastnameZone.id = 'lastname';
        contactProfileLastnameZone.placeholder = 'Lastame';
        contactProfileLastnameZone.style.backgroundColor = '#97d696';
        contactProfileLastnameZone.oninput = function () {this.value=this.value.replace(/[^\qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM]/ig, '')};
        contactProfileLastnameZone.innerHTML = '<input>';
        lastnameZone.appendChild(contactProfileLastnameZone);

        //PhoneZone
        var phoneLength = tmpArrReCall.phone.length;
        //Первое(дефолтное поле ввода)
        var inputPhone = doc.getElementById('inputPhone');
        var firsPhone = doc.createElement('input');
        firsPhone.value = tmpArrReCall.phone[0];
        firsPhone.id = 'phone1';
        firsPhone.className = 'input_zone';
        firsPhone.placeholder = 'Phone';
        firsPhone.style.backgroundColor = '#97d696';
        firsPhone.oninput = function () {this.value = this.value.replace (/\D/, '')};
        firsPhone.innerHTML = '<input type="tel" name="phone"  oninput="this.value = this.value.replace (/\\D/, \'\')">';
        inputPhone.appendChild(firsPhone);
        //ButtonZone
        let buttonPhoneAdd = doc.createElement('button');
        buttonPhoneAdd.id = 'addPhone';
        buttonPhoneAdd.className = 'new_phone_mail';
        buttonPhoneAdd.type = 'button';
        buttonPhoneAdd.innerHTML = '+';
        inputPhone.appendChild(buttonPhoneAdd);

        let buttonPhoneRemove = doc.createElement('button');
        buttonPhoneRemove.id = 'removePhone';
        buttonPhoneRemove.className = 'new_phone_mail';
        buttonPhoneRemove.type = 'button';
        buttonPhoneRemove.innerHTML = '-';
        inputPhone.appendChild(buttonPhoneRemove);

        //Добавление остальных номеров
        if (phoneLength > 1) {
            for (var i=1; i<phoneLength; i++) {
                var anothetPhone = doc.createElement('input');
                anothetPhone.className = 'input_zone';
                anothetPhone.value = tmpArrReCall.phone[i];
                anothetPhone.id = 'phone' + (i+1);
                anothetPhone.placeholder = 'Phone'+ (i+1);
                anothetPhone.style.backgroundColor = '#97d696';
                anothetPhone.oninput = function () {this.value = this.value.replace (/\D/, '')};
                anothetPhone.innerHTML = '<input type="tel" name="phone">';
                inputPhone.appendChild(anothetPhone);
            }
        }

        //MailZone
        let mailLength = tmpArrReCall.mail.length;
        //Первое(дефолтное поле ввода)
        let inputMail = doc.getElementById('inputMail');
        let firsMail = doc.createElement('input');
        firsMail.value = tmpArrReCall.mail[0];
        firsMail.id = 'mail1';
        firsMail.className = 'input_zone';
        firsMail.placeholder = 'Mail';
        if (tmpArrReCall.mail[0] !== '') {
            firsMail.readOnly = 'readOnly';
            firsMail.style.backgroundColor = '#97d696';
        }
        firsMail.innerHTML = '<input type="email" name="mail">';
        inputMail.appendChild(firsMail);
        let buttonMailAdd = doc.createElement('button');
        buttonMailAdd.id = 'addMail';
        buttonMailAdd.className = 'new_phone_mail';
        buttonMailAdd.type = 'button';
        buttonMailAdd.innerHTML = '+';
        inputMail.appendChild(buttonMailAdd);

        let buttonMailRemove = doc.createElement('button');
        buttonMailRemove.id = 'removeMail';
        buttonMailRemove.className = 'new_phone_mail';
        buttonMailRemove.type = 'button';
        buttonMailRemove.innerHTML = '-';
        inputMail.appendChild(buttonMailRemove);

        //Добавление остальных мейлов
        if (mailLength > 1) {
            for (let i=1; i<mailLength; i++) {
                let anothetMail = doc.createElement('input');
                anothetMail.className = 'input_zone';
                anothetMail.value = tmpArrReCall.mail[i];
                anothetMail.id = 'mail' + (i+1);
                anothetMail.placeholder = 'Mail'+ (i+1);
                anothetMail.readOnly = 'readOnly';
                anothetMail.style.backgroundColor = '#97d696';
                anothetMail.innerHTML = '<input type="email" name="mail">';
                inputMail.appendChild(anothetMail);
            }
        }

        //CLOSE
        let close = doc.getElementById('close');
        close.addEventListener('click', closeContact);

        //SAVE
        let save = doc.getElementById('save');
        save.addEventListener('click', saveContact);

        //DELETE
        let deleteContact = doc.getElementById('del');
        deleteContact.addEventListener('click', removeContact);

        //ДЕЙСТВИЯ ПО КНОПКЕ [+] Phone
        let addPhone = doc.getElementById('addPhone');
        SomePhoneNumerator2 = tmpArrReCall.phone.length;
        addPhone.addEventListener('click', newPhoneInput);

        //ДЕЙСТВИЯ ПО КНОПКЕ [-] Phone
        let removePhone = doc.getElementById('removePhone');
        removePhone.addEventListener('click', removePhoneInput);

        //Действия кнопки [+] Mail
        let addMail = doc.getElementById('addMail');
        permissionToNewMailInput = true;
        SomeMailNumerator2 = tmpArrReCall.mail.length;
        addMail.addEventListener('click', newMailInput);

        //Действия кнопки [-] Mail
        let removeMail = doc.getElementById('removeMail');
        removeMail.addEventListener('click', removeMailInput);

        //Валидация Mail input
        inputMail.addEventListener('input', oldMailValidation);

        //Подсказка на Name
        // let nameZone = doc.getElementById('name');
        nameZone.addEventListener('input', hintName);

        //Подсказка на Lastname
        // let lastnameZone = doc.getElementById('lastname');
        lastnameZone.addEventListener('input', hintLastname);

        //Подсказка на Phone
        let phoneZone = doc.getElementById('phone1');
        phoneZone.addEventListener('input', hintPhone);
    };

    contactListID .addEventListener('click', showContact);

    //КНОПОЧКИ
    //ДЕЙСТВИЯ ПО КНОПКЕ "CLOSE"---------------------------------------
    let closeContact = function () {
        someMailNumerator = 1;
        somePhoneNumerator = 1;
        let closeW = doc.getElementById('newContact');
        let closeB = doc.getElementById('backing');
        closeW.remove();
        closeB.remove();
    };

    //ДЕЙСТВИЯ ПО КНОПКЕ "DELETE"--------------------------------------
    let removeContact = function () {
        if (control.length > 1){
            for (var x=0; x<control.length; x++) {
                // console.log(control.length, x);
                parent_block.removeChild(doc.getElementById(x));
            }
            control.splice(tmpID, 1);
            localStorage.setItem('controlKey', JSON.stringify(control));
            start();
        } else {
            parent_block.removeChild(doc.getElementById('0'));
            localStorage.removeItem('controlKey');
            control = [];
        }
        closeContact();
        popupRemoveComplete()
    };

    //ДЕЙСТВИЯ ПО КНОПКЕ "SAVE"-----------------------------------------
    let saveContact = function () {
        let name = document.getElementById("name").value;
        let lastname = document.getElementById("lastname").value;
        let phone = document.getElementById("phone1").value;
        let mail = document.getElementById("mail1").value;


        let tmparr = { name: name,
            lastname: lastname,
            phone: [phone],
            mail: [mail]
        };

        let PhoneNumerator = SomePhoneNumerator2;
        if (PhoneNumerator > 1) {
            for (var i=2; i<=PhoneNumerator; i++) {
                var tmpPhone = doc.getElementById("phone" + i).value;
                if (tmpPhone.length > 2) {
                    tmparr.phone.push(tmpPhone);
                }
            }
        }

        // let MailNumerator = SomeMailNumerator2+1;
        let MailNumerator = SomeMailNumerator2;
        if (MailNumerator > 1) {
            for (var i=2; i<=MailNumerator; i++) {
                var tmpMail = doc.getElementById("mail" + i).value;
                if (tmpMail !== '') {
                    tmparr.mail.push(tmpMail);
                }
            }
        }

        //Условие на пропуск первого поля mail
        if (tmparr.mail.length != 1 && tmparr.mail[0] == '') {
            tmparr.mail.shift();
        }

        let contactValidation = 1;
        if ((tmparr.name.toLowerCase() +' '+ tmparr.lastname.toLowerCase()) !== (control[tmpID].name.toLowerCase() +' '+ control[tmpID].lastname.toLowerCase())){
        for (var i = 0; i<control.length; i++) {
            let tmpContactData = control[i].name.toLowerCase() +' '+ control[i].lastname.toLowerCase();
            let tmpContactValue = tmparr.name.toLowerCase() +' '+ tmparr.lastname.toLowerCase();
            // console.log(tmpContactValue +'  '+tmpContactData+'  '+contactValidation);
            if (tmpContactData === tmpContactValue) {
                contactValidation = 0;
                } else {
                Prevention();
                }
            }
        }


        //Собственно само условие!
        if (name.length >=2 && lastname.length >=2 && phone.length >= 3 && contactValidation !== 0 && mailCorrect === true) {

            //Перезапись ключа в localStorage
            control[tmpID] = tmparr;
            localStorage.setItem('controlKey', JSON.stringify(control));

            if (control.length >= 1){
                refreshContact();
            }
            control = JSON.parse(localStorage.getItem('controlKey'));
            closeContact();  //закрытие окна контакта
            popupSaveComplete()
        }
    };

    let oldMailValidation = function (e) {
        var e = e || event;
        var target = e.target || e.srcElement;
        tmpMailID = target.id;
        let mail = doc.getElementById(tmpMailID);
        // console.log(tmpMailID);
        // console.log(mail.value);

        if (mail.value.indexOf('@') >= 0 && mail.value.indexOf('.') > mail.value.indexOf('@') +1 && mail.value.length > mail.value.indexOf('.') +2) {
            mailCorrect = true;
            permissionToNewMailInput = true;
            doc.getElementById('mail' + SomeMailNumerator2).style.backgroundColor = '#97d696';
        } else if (mail.value == '') {
            mailCorrect = true;
            permissionToNewMailInput = false;
            doc.getElementById('mail' + SomeMailNumerator2).style.backgroundColor = 'white';
        } else {
            mailCorrect = false;
            permissionToNewMailInput = false;
            doc.getElementById('mail' + SomeMailNumerator2).style.backgroundColor = '#f1bdbd';
        }
    };

    //ДЕЙСТВИЯ ПО КНОПКЕ [+] Phone
    let newPhoneInput = function () {
        if (doc.getElementById("phone" + SomePhoneNumerator2).value.length > 2) {
            SomePhoneNumerator2++;
            let somePhone = "phone" + SomePhoneNumerator2;
            console.log(somePhone);

            let newInput = doc.createElement('input');
            newInput.id = somePhone;
            newInput.placeholder = somePhone;
            newInput.className = 'input_zone';
            newInput.oninput = function () {
                this.value = this.value.replace(/\D/, '')
            };
            newInput.innerHTML = '<input type="tel" name="phone">';
            inputPhone.appendChild(newInput);
        }
    };

    //ДЕЙСТВИЯ ПО КНОПКЕ [-] Phone
    let removePhoneInput = function () {
        if (SomePhoneNumerator2>1){
            let tmpRemovePhone = doc.getElementById("phone"+SomePhoneNumerator2);
            tmpRemovePhone.remove();
            SomePhoneNumerator2--;
        }
    };

    //Действия кнопки [+] Mail
    let newMailInput = function () {
        if (permissionToNewMailInput === true) {
            permissionToNewMailInput = false;
            let secondMailInput = doc.getElementById('mail2');
            SomeMailNumerator2++;
            // console.log(SomeMailNumerator2, secondMailInput);
            let someMail = "mail" + SomeMailNumerator2;
            let readOnlyMail = "mail" + (SomeMailNumerator2 - 1);
            // console.log(readOnlyMail);
            document.getElementById(readOnlyMail).setAttribute("readOnly", "readOnly");

            let newInput = doc.createElement('input');
            newInput.id = someMail;
            newInput.placeholder = someMail;
            newInput.className = 'input_zone';
            newInput.setAttribute('input', oldMailValidation);
            newInput.innerHTML = '<input type="email" name="mail">';
            inputMail.appendChild(newInput);
        }
    };

    //Действия кнопки [-] Mail
    let removeMailInput = function () {
        if (SomeMailNumerator2 > 1) {
            let tmpRemoveMail = doc.getElementById("mail" + SomeMailNumerator2);
            tmpRemoveMail.remove();
            SomeMailNumerator2--;
            // console.log(SomeMailNumerator2);
        } else {
            doc.getElementById('mail1').readOnly = false;
        }
    };

    // ПОИСК
    search.addEventListener("input", function () {
        for (var i = 0; i<control.length; i++){
            let blockContent = document.getElementById(i).innerText;
            doc.getElementById(i).style.display = '';
            if (blockContent.toLowerCase().indexOf(search.value.toLowerCase()) === -1){
                doc.getElementById(i).style.display = 'none';
            }
        }
    });
