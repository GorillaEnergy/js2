    let doc = window.document;
    let add = document.getElementById('add');
    let parent_block = doc.getElementById('parent_block');
    let main_block = doc.getElementById('main_block');
    let header = doc.getElementById('header');
    let search = doc.getElementById('search');
    let somePhoneNumerator = 0;
    let someMailNumerator = 0;
    let popupSave = doc.getElementById('saveComplete');
    let popupRemove = doc.getElementById('removeComplete');
    let prevention = doc.getElementById('prevention');
    let popupPhoneValidation = doc.getElementById('PhoneValidation');
    let popupMailValidation = doc.getElementById('MailValidation');
    let mailValidation;
    let tmparr;
    let tmpPhoneArr = [];
    let tmpMailArr = [];
    let tmpPhoneID;
    let tmpMailID;
    let tmpPhoneValue;
    let tmpMailValue;
    let tmpRemoveId;
    let tmpIdent;
    let tmpPhoneValueSave;
    let tmpMailValueSave;

    //  ЗАГРУЗКА СПИСКА ИЗ localStorage ----------------------------------------------
    var control = JSON.parse(localStorage.getItem('controlKey'));
    // window.onload = start();
    let start = function () {
        if (control !== null) {
         for ( let i = 0; i<control.length; i++) {
                let tmpi = control[i];
                let addNewContact = doc.createElement('div');
                addNewContact.id = i;
                addNewContact.className = 'my-message my-message-title';
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
        let backing = doc.createElement('div');
        backing.innerHTML = '<div class="backing clearfix" id="backing"></div>';
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
                    <input type="tel" oninput="this.value = this.value.replace (/\\D/, \'\')" name="phone" class="input_zone" placeholder="Enter phone" id="phone">\
                    <button class="add_new_phone_mail" type="button" id="addPhone">Add</button>\
                </div>\
                <div class="clearfix" id="inputMail">\
                    <input type="email" name="mail" class="input_zone" placeholder="Enter email" id="mail" oninput="ValidMail()">\
                    <button class="add_new_phone_mail" type="button" id="addMail">Add</button>\
                </div>\
            </div>';
        header.appendChild(contactProfile);

        //CLOSE
        let close = doc.getElementById('close');
        close.addEventListener('click', closeContact);

        //SAVE
        let save = doc.getElementById('save');
        save.addEventListener('click', saveNewContact);

        //Действия кнопки [Add] Phone
        let addPhone = doc.getElementById('addPhone');
        let inputPhone = doc.getElementById('inputPhone');
        addPhone.addEventListener('click', addnewphone);

        //Действия кнопки [Add] Mail
        let addMail = doc.getElementById('addMail');
        let inputMail = doc.getElementById('inputMail');
        addMail.addEventListener('click', addnewmail);

        //Подсказка на Name
        let nameZone = doc.getElementById('name');
        nameZone.addEventListener('input', hintName);

        //Подсказка на Lastname
        let lastnameZone = doc.getElementById('lastname');
        lastnameZone.addEventListener('input', hintLastname);

        //Подсказка на Phone
        let phoneZone = doc.getElementById('phone');
        phoneZone.addEventListener('input', hintPhone);

        let name = document.getElementById("name").value;
        let lastname = document.getElementById("lastname").value;
        tmparr = { name: name,
            lastname: lastname,
            phone: [],
            mail: []
        };
    };
     add.addEventListener('click', addNewContact);

    //SAVE button
    let saveNewContact = function () {
        tmparr.name = document.getElementById("name").value;
        tmparr.lastname = document.getElementById("lastname").value;
        tmparr.phone = [];
        tmparr.mail = [];

        //Запись изменений PhoneZone в tmparr
        if (somePhoneNumerator !== 0) {
            for (let p=0; p<somePhoneNumerator; p++) {
                let tmpArrPhone = doc.getElementById("phone" + (p+1)).value;
                if (tmpArrPhone.length > 2) {
                    tmparr.phone.push(tmpArrPhone);
                }
            }
        }
        //Запись изменений MailZone в tmparr
        if (someMailNumerator !== 0) {
            for (let m=0; m<someMailNumerator; m++) {

                let tmpArrMail = doc.getElementById("mail" + (m+1)).value;
                var re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
                mailValidation = re.test(tmpArrMail);
                // return mailValidation;

                if (mailValidation === true){
                    tmparr.mail.push(tmpArrMail);
                } else {
                    doc.getElementById('mail' + (m+1)).style.backgroundColor = '#f1bdbd';
                }
            }
        }
        //Условия на Совпадение контактов(по name, lastname)
        let contactValidation = 1;
        if (control.length !== 0) {
            for (var i = 0; i < control.length; i++) {
                let tmpContactData = control[i].name.toLowerCase() + ' ' + control[i].lastname.toLowerCase();
                let tmpContactValue = tmparr.name.toLowerCase() + ' ' + tmparr.lastname.toLowerCase();
                if (tmpContactData === tmpContactValue) {
                    contactValidation = 0;
                    Prevention();
                    doc.getElementById('name').style.backgroundColor = '#f1bdbd';
                    doc.getElementById('lastname').style.backgroundColor = '#f1bdbd';
                    setTimeout(function () {doc.getElementById('name').style.backgroundColor = '#97D696';}, 2000);
                    setTimeout(function () {doc.getElementById('lastname').style.backgroundColor = '#97D696';}, 2000);
                }
            }
        }

        //Сохранение
        if (tmparr.name.length >=2 && tmparr.lastname.length >=2 && tmparr.phone.length > 0 && contactValidation === 1) {
            if (control !== null){
                control.push(tmparr);
            }
            localStorage.setItem('controlKey', JSON.stringify(control));

            tmpPhoneArr = [];
            tmpMailArr = [];
            if (control.length >= 1){
                refreshContact();
            }
            closeContact();
            popupSaveComplete();

            somePhoneNumerator = 0;
            someMailNumerator = 0;
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
    //Popup PhoneValidation
    function PhoneValidation() {
        setTimeout(function() {popupPhoneValidation.style.display = 'block';}, 100);
        setTimeout(function() {popupPhoneValidation.style.display = 'none';}, 2000);
    }
    //Popup MailValidation
    function popUpMailValidation() {
        setTimeout(function() {popupMailValidation.style.display = 'block';}, 100);
        setTimeout(function() {popupMailValidation.style.display = 'none';}, 2000);
    }

    //Действия кнопки [Add] Phone
    let addnewphone = function () {
        let phoneInputField = doc.getElementById("phone");
        let inputPhone = doc.getElementById('inputPhone');
        let inputPhoneValue = doc.getElementById('phone').value;

        let tmpPhoneValid = true;

        if (tmpPhoneArr.length > 0)  {
            for (var i=0 ; i<tmpPhoneArr.length; i++) {
                if (inputPhoneValue === tmpPhoneArr[i]) {
                    tmpPhoneValid = false;
                    let tmpHint = doc.getElementById('phone' + (i+1));
                    let tmpColor = tmpHint.style.backgroundColor;
                    PhoneValidation();
                    setTimeout(function() {tmpHint.style.backgroundColor = '#f1bdbd';}, 0);
                    setTimeout(function() {tmpHint.style.backgroundColor = tmpColor;}, 2000);
                    doc.getElementById('phone').style.backgroundColor = '#f1bdbd';
                }
            }
        }

        if (phoneInputField.value.length > 2 && tmpPhoneValid === true) {
            tmpPhoneArr.push(inputPhoneValue);

            somePhoneNumerator++;
            let somePhone = "phone" + somePhoneNumerator;
            let someSave = "save" + somePhoneNumerator;
            let someRemove = "remove" + somePhoneNumerator;

            let newInput = doc.createElement('input');
            newInput.id = somePhone;
            newInput.name = somePhoneNumerator;
            newInput.value = inputPhoneValue;
            newInput.placeholder = "Phone" + somePhoneNumerator;
            newInput.className = 'input_zone';
            newInput.readOnly = true;
            newInput.style.backgroundColor = '#97D696';
            newInput.onfocus = tmpPhoneNumberAction;
            newInput.onkeyup = tmpPhoneNumberActionOnKeyup;
            newInput.onblur = tmpPhoneNumberActionOnBlur;
            newInput.oninput = function () {this.value = this.value.replace (/\D/, '')};
            inputPhone.appendChild(newInput);

            let newRemoveButton = doc.createElement('button');
            newRemoveButton.id = someRemove;
            newRemoveButton.name = somePhoneNumerator;
            newRemoveButton.className = 'new_phone_mail';
            newRemoveButton.type = 'button';
            newRemoveButton.onclick = tmpPhoneNumberRemove;
            newRemoveButton.style.backgroundColor = 'red';
            // newRemoveButton.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true" style="font-size: 30px; color: red; margin-left: -3px"></i>';
            newRemoveButton.innerText = '-';
            inputPhone.appendChild(newRemoveButton);

            doc.getElementById('phone').value = '';
            doc.getElementById('phone').style.backgroundColor = 'white';
        }
    };

    //Действия кнопки [Add] Mail
    let addnewmail = function () {
        let mailInputField = doc.getElementById("mail");
        let inputMail = doc.getElementById('inputMail');
        let inputMailValue = doc.getElementById('mail').value;

        let tmpMailResemblance = true;

        if (tmpMailArr.length > 0)  {
            for (var i=0 ; i<tmpMailArr.length; i++) {
                if (inputMailValue === tmpMailArr[i]) {
                    tmpMailResemblance = false;
                    let tmpHint = doc.getElementById('mail' + (i+1));
                    let tmpColor = tmpHint.style.backgroundColor;
                    popUpMailValidation();
                    setTimeout(function() {tmpHint.style.backgroundColor = '#f1bdbd';}, 0);
                    setTimeout(function() {tmpHint.style.backgroundColor = tmpColor;}, 2000);
                    doc.getElementById('mail').style.backgroundColor = '#f1bdbd';
                }
            }
        }

        if (mailInputField.value.length > 2 && tmpMailResemblance === true && mailValidation === true) {
            tmpMailArr.push(inputMailValue);

            someMailNumerator++;
            let someMail = "mail" + someMailNumerator;
            let someSave = "saveM" + someMailNumerator;
            let someRemove = "removeM" + someMailNumerator;

            let newInput = doc.createElement('input');
            newInput.id = someMail;
            newInput.name = someMailNumerator;
            newInput.value = inputMailValue;
            newInput.placeholder = "Mail" + someMailNumerator;
            newInput.className = 'input_zone';
            newInput.readOnly = true;
            newInput.style.backgroundColor = '#97D696';
            newInput.onfocus = tmpMailAction;
            newInput.onkeyup = tmpMailActionOnKeyup;
            newInput.oninput = ValidMailDynamicElem;
            newInput.onblur = tmpMailActionOnBlur;
            inputMail.appendChild(newInput);

            let newRemoveButton = doc.createElement('button');
            newRemoveButton.id = someRemove;
            newRemoveButton.name = someMailNumerator;
            newRemoveButton.className = 'new_phone_mail';
            newRemoveButton.type = 'button';
            newRemoveButton.onclick = tmpMailRemove;
            newRemoveButton.style.backgroundColor = 'red';
            // newRemoveButton.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true" style="font-size: 30px; color: red; margin-left: -3px"></i>';
            newRemoveButton.innerText = '-';
            inputMail.appendChild(newRemoveButton);

            doc.getElementById('mail').value = '';
            doc.getElementById('mail').style.backgroundColor = 'white';
        }
    };

    //Mail Validation
    let ValidMail = function () {
        var re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
        var mail = document.getElementById('mail').value;
        mailValidation = re.test(mail);
        if (mailValidation) {
            document.getElementById('mail').style.background = '#97D696';
        } else if (mail == '') {
            document.getElementById('mail').style.background = 'white';
        } else {
            document.getElementById('mail').style.background = '#f1bdbd';
        }
        return mailValidation;

    };

    //Mail Validation Dynamic Elements
    let ValidMailDynamicElem = function (e) {
        var e = e || event;
        var target = e.target || e.srcElement;
        tmpMailID = target.id;

        var re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
        var mail = document.getElementById(tmpMailID).value;
        mailValidation = re.test(mail);
        if (mailValidation) {
            document.getElementById(tmpMailID).style.background = '#97D696';
        } else if (mail == '') {
            document.getElementById(tmpMailID).style.background = 'white';
        } else {
            document.getElementById(tmpMailID).style.background = '#f1bdbd';
        }
        return mailValidation;

    };

    //Действия по нажатию на tmpPhoneNumber
    let tmpPhoneNumberAction = function (e) {

        var e = e || event;
        var target = e.target || e.srcElement;

        tmpPhoneID = target.id;
        tmpIdent = doc.getElementById(tmpPhoneID).name;
        doc.getElementById(tmpPhoneID).readOnly = false;
        doc.getElementById('remove' + tmpIdent).style.visibility = 'visible';
        tmpPhoneValue = doc.getElementById(tmpPhoneID).value;
    };

    //Действия по нажатию на tmpMail
    let tmpMailAction = function (e) {

        var e = e || event;
        var target = e.target || e.srcElement;

        tmpMailID = target.id;
        tmpIdent = doc.getElementById(tmpMailID).name;
        doc.getElementById(tmpMailID).readOnly = false;
        doc.getElementById('removeM' + tmpIdent).style.visibility = 'visible';
        tmpMailValue = doc.getElementById(tmpMailID).value;
    };

    //Действия при onkeyup tmpPhoneNumber
    let tmpPhoneNumberActionOnKeyup = function (e) {

        var e = e || event;
        var target = e.target || e.srcElement;

        tmpPhoneID = target.id;
        tmpIdent = doc.getElementById(tmpPhoneID).name;
        tmpPhoneValueSave = doc.getElementById(tmpPhoneID).value;
        tmpPhoneArr[tmpIdent-1] = tmpPhoneValueSave;
        if (tmpPhoneValueSave.length < 3) {
            doc.getElementById(tmpPhoneID).style.backgroundColor = '#f1bdbd';
        } else {
            doc.getElementById(tmpPhoneID).style.backgroundColor = '#97D696';
        }
    };

    //Действия при onblur tmpPhoneNumber
    let tmpPhoneNumberActionOnBlur = function (e) {

        var e = e || event;
        var target = e.target || e.srcElement;

        tmpPhoneID = target.id;
        tmpIdent = doc.getElementById(tmpPhoneID).name;
        let removeButton = document.getElementById('remove'+ tmpIdent);
        setTimeout(function () {removeButton.style.visibility = 'hidden'}, 200);

    };
    //Действия при onblur tmpMail
    let tmpMailActionOnBlur = function (e) {

        var e = e || event;
        var target = e.target || e.srcElement;

        tmpPhoneID = target.id;
        tmpIdent = doc.getElementById(tmpPhoneID).name;
        let removeButton = document.getElementById('removeM'+ tmpIdent);
        setTimeout(function () {removeButton.style.visibility = 'hidden'}, 200);

    };

    // Действия при onkeyup tmpMail
    let tmpMailActionOnKeyup = function (e) {

        var e = e || event;
        var target = e.target || e.srcElement;

        tmpMailID = target.id;
        tmpIdent = doc.getElementById(tmpMailID).name;
        tmpMailValueSave = doc.getElementById(tmpMailID).value;
        tmpMailArr[tmpIdent-1] = tmpMailValueSave;
    };

    //Действия при Удалении! tmpPhoneNumber
    let tmpPhoneNumberRemove = function (e) {

        var e = e || event;
        var target = e.target || e.srcElement;

        tmpRemoveId = target.id;
        tmpIdent = doc.getElementById(tmpRemoveId).name;
        let inputPhone = doc.getElementById('inputPhone');

        if (tmpPhoneArr.length > 1) {
            tmpPhoneArr.splice((tmpIdent-1), 1);
            tmparr.phone.splice((tmpIdent-1), 1);
            somePhoneNumerator--
        } else {
            tmpPhoneArr =[];
            somePhoneNumerator = 0
        }

        for (var i=0; i<tmpPhoneArr.length+1; i++) {
            let phone = doc.getElementById('phone' + (i+1));
            let remove = doc.getElementById('remove' + (i+1));
            inputPhone.removeChild(phone);
            inputPhone.removeChild(remove);
        }
        buildPhones();
    };

    //Действия при Удалении! tmpMail
    let tmpMailRemove = function (e) {

        var e = e || event;
        var target = e.target || e.srcElement;

        tmpRemoveId = target.id;
        tmpIdent = doc.getElementById(tmpRemoveId).name;
        let inputMail = doc.getElementById('inputMail');

        if (tmpMailArr.length > 1) {
            tmpMailArr.splice((tmpIdent-1), 1);
            tmparr.mail.splice((tmpIdent-1), 1);
            someMailNumerator--
        } else {
            tmpMailArr =[];
            someMailNumerator = 0
        }

        for (var i=0; i<tmpMailArr.length+1; i++) {
            let mail = doc.getElementById('mail' + (i+1));
            let remove = doc.getElementById('removeM' + (i+1));
            inputMail.removeChild(mail);
            inputMail.removeChild(remove);
        }
        buildMails();
    };

    //Запись(стройка) контактов с tmpPhoneArr
    let buildPhones = function () {
        somePhoneNumerator = 0;
        for (x=0; x<tmpPhoneArr.length; x++) {
            buildPhonesBody()
        }
    };
    let buildPhonesBody = function () {
            somePhoneNumerator++;
            let inputPhone = doc.getElementById('inputPhone');
            let somePhone = "phone" + somePhoneNumerator;
            let someRemove = "remove" + somePhoneNumerator;
            let inputPhoneValue = tmpPhoneArr[x];

            let newInput = doc.createElement('input');
            newInput.id = somePhone;
            newInput.name = somePhoneNumerator;
            newInput.value = inputPhoneValue;
            newInput.placeholder = "Phone" + somePhoneNumerator;
            newInput.className = 'input_zone';
            newInput.readOnly = true;
            if (inputPhoneValue.length >2) {
                newInput.style.backgroundColor = '#97D696';
            } else {
                newInput.style.backgroundColor = '#f1bdbd';
            }
            newInput.onfocus = tmpPhoneNumberAction;
            newInput.onkeyup = tmpPhoneNumberActionOnKeyup;
            newInput.onblur = tmpPhoneNumberActionOnBlur;
            newInput.oninput = function () {this.value = this.value.replace (/\D/, '')};
            inputPhone.appendChild(newInput);

            let newRemoveButton = doc.createElement('button');
            newRemoveButton.id = someRemove;
            newRemoveButton.name = somePhoneNumerator;
            newRemoveButton.placeholder = "save" + somePhoneNumerator;
            newRemoveButton.className = 'new_phone_mail';
            newRemoveButton.type = 'button';
            newRemoveButton.onclick = tmpPhoneNumberRemove;
            newRemoveButton.style.backgroundColor = 'red';
            // newRemoveButton.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true" style="font-size: 30px; color: red; margin-left: -3px"></i>';
            newRemoveButton.innerText = '-';
            inputPhone.appendChild(newRemoveButton);
    };

    //Запись(стройка) контактов с tmpMailArr
    let buildMails = function () {
        someMailNumerator = 0;
        for (y=0; y<tmpMailArr.length; y++) {
            buildMailsBody()
        }
    };
    let buildMailsBody = function () {
        someMailNumerator++;
        let inputMail = doc.getElementById('inputMail');
        let someMail = "mail" + someMailNumerator;
        let someRemove = "removeM" + someMailNumerator;
        let inputMailValue = tmpMailArr[y];

        let newInput = doc.createElement('input');
        newInput.id = someMail;
        newInput.name = someMailNumerator;
        newInput.value = inputMailValue;
        newInput.placeholder = "Mail" + someMailNumerator;
        newInput.className = 'input_zone';
        newInput.readOnly = true;
        newInput.onfocus = tmpMailAction;
        newInput.onkeyup = tmpMailActionOnKeyup;
        newInput.oninput = ValidMailDynamicElem;
        newInput.onblur = tmpMailActionOnBlur;
        inputMail.appendChild(newInput);

        var re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
        mailValidation = re.test(inputMailValue);
        if (mailValidation === true){
            newInput.style.backgroundColor = '#97D696';
        } else {
            newInput.style.backgroundColor = '#f1bdbd';
        }

        let newRemoveButton = doc.createElement('button');
        newRemoveButton.id = someRemove;
        newRemoveButton.name = someMailNumerator;
        newRemoveButton.className = 'new_phone_mail';
        newRemoveButton.type = 'button';
        newRemoveButton.onclick = tmpMailRemove;
        newRemoveButton.style.backgroundColor = 'red';
        newRemoveButton.innerText = '-';
        inputMail.appendChild(newRemoveButton);
    };

    //Перезалив контактов refreshContact
    let refreshContact = function () {
            for (var x=0; x<control.length-1; x++) {
                parent_block.removeChild(doc.getElementById(x));
            }
        start();
    };
    let refreshContact2 = function () {
        for (var x=0; x<control.length; x++) {
            parent_block.removeChild(doc.getElementById(x));
        }
        start();
    };
    //Подсказка на Name, Lastname, Phone
    let hintName = function () {
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
        let phone = doc.getElementById('phone');
        if (phone.value.length > 2){
            phone.style.backgroundColor = '#97D696'
        } else if (phone.value === ''){
            phone.style.backgroundColor = 'white'
        }else {
            phone.style.backgroundColor = '#f1bdbd'
        }
    };

////////////////////////ДЕЙСТВИЯ ПО НАЖАТИЮ НА КОНТАКТ/////////////////////////////
    let contactListID = doc.getElementById('parent_block');
    let showContact = function (e) {

        var e = e || event;
        var target = e.target || e.srcElement;
        tmpID = target.id;

        let tmpArrReCall = control[tmpID];

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
                    <input type="tel" oninput="this.value = this.value.replace (/\\D/, \'\')" name="phone" class="input_zone" placeholder="Enter phone" id="phone">\                    \
                    <button class="add_new_phone_mail" type="button" id="addPhone">Add</button>\
                </div>\
                <div class="clearfix" id="inputMail">\
                    <input type="email" name="mail" class="input_zone" placeholder="Enter email" id="mail" oninput="ValidMail()">\
                    <button class="add_new_phone_mail" type="button" id="addMail">Add</button>\
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
        tmpPhoneArr = tmpArrReCall.phone;
        buildPhones();

        //MailZone
        tmpMailArr = tmpArrReCall.mail;
        if (tmpMailArr.length !== 0) {
            buildMails();
        }

        //CLOSE
        let close = doc.getElementById('close');
        close.addEventListener('click', closeContact);

        //SAVE
        let save = doc.getElementById('save');
        save.addEventListener('click', saveContact);
        // save.addEventListener('click', saveNewContact);

        //DELETE
        let deleteContact = doc.getElementById('del');
        deleteContact.addEventListener('click', removeContact);

        //Действия кнопки [Add] Phone
        let addPhone = doc.getElementById('addPhone');
        let inputPhone = doc.getElementById('inputPhone');
        addPhone.addEventListener('click', addnewphone);

        //Действия кнопки [Add] Mail
        let addMail = doc.getElementById('addMail');
        let inputMail = doc.getElementById('inputMail');
        addMail.addEventListener('click', addnewmail);

        //Подсказка на Name
        let nameInput = doc.getElementById('name');
        nameInput.addEventListener('input', hintName);

        //Подсказка на Lastname
        let lastnameInput = doc.getElementById('lastname');
        lastnameInput.addEventListener('input', hintLastname);

        //Подсказка на Phone
        let phoneZone = doc.getElementById('phone');
        phoneZone.addEventListener('input', hintPhone);

        let name = document.getElementById("name").value;
        let lastname = document.getElementById("lastname").value;
        tmparr = { name: name,
            lastname: lastname,
            phone: [],
            mail: []
        };
    };

    contactListID .addEventListener('click', showContact);

    //КНОПОЧКИ
    //ДЕЙСТВИЯ ПО КНОПКЕ "CLOSE"---------------------------------------
    let closeContact = function () {
        someMailNumerator = 0;
        somePhoneNumerator = 0;
        tmpPhoneArr = [];
        tmpMailArr = [];
        let closeW = doc.getElementById('newContact');
        let closeB = doc.getElementById('backing');
        closeW.remove();
        closeB.remove();
    };

    //ДЕЙСТВИЯ ПО КНОПКЕ "DELETE"--------------------------------------
    let removeContact = function () {
        if (control.length > 1){
            for (var x=0; x<control.length; x++) {
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

        tmparr.name = document.getElementById("name").value;
        tmparr.lastname = document.getElementById("lastname").value;
        tmparr.phone = [];
        tmparr.mail = [];

        //Запись изменений PhoneZone в tmparr
        if (somePhoneNumerator !== 0) {
            for (let p=0; p<somePhoneNumerator; p++) {
                let tmpArrPhone = doc.getElementById("phone" + (p+1)).value;
                if (tmpArrPhone.length > 2) {
                    tmparr.phone.push(tmpArrPhone);

                }
            }
        }
        //Запись изменений MailZone в tmparr
        if (someMailNumerator !== 0) {
            for (let m=0; m<someMailNumerator; m++) {

                let tmpArrMail = doc.getElementById("mail" + (m+1)).value;
                var re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
                mailValidation = re.test(tmpArrMail);
                // return mailValidation;

                if (mailValidation === true){
                    tmparr.mail.push(tmpArrMail);
                } else {
                    doc.getElementById('mail' + (m+1)).style.backgroundColor = '#f1bdbd';
                }
            }
        }

        //Условия на Совпадение контактов(по name, lastname)
        let contactValidation = 1;
        if ((tmparr.name.toLowerCase() +' '+ tmparr.lastname.toLowerCase()) !== (control[tmpID].name.toLowerCase() +' '+ control[tmpID].lastname.toLowerCase())) {
            for (var i = 0; i < control.length; i++) {
                let tmpContactData = control[i].name.toLowerCase() + ' ' + control[i].lastname.toLowerCase();
                let tmpContactValue = tmparr.name.toLowerCase() + ' ' + tmparr.lastname.toLowerCase();
                if (tmpContactData === tmpContactValue) {
                    //Нашли совпадение!!!  Убираем розрешение на сохранение(contactValidation = 0) и уведомляем пользователя
                    contactValidation = 0;
                    Prevention();
                    doc.getElementById('name').style.backgroundColor = '#f1bdbd';
                    doc.getElementById('lastname').style.backgroundColor = '#f1bdbd';
                    setTimeout(function () {
                        doc.getElementById('name').style.backgroundColor = '#97D696';
                    }, 2000);
                    setTimeout(function () {
                        doc.getElementById('lastname').style.backgroundColor = '#97D696';
                    }, 2000);
                }
            }
        }

        // Сохранение
        if (tmparr.name.length >=2 && tmparr.lastname.length >=2 && tmparr.phone.length > 0 && contactValidation === 1) {
            control[tmpID] = tmparr;
            localStorage.setItem('controlKey', JSON.stringify(control));

            tmpPhoneArr = [];
            tmpMailArr = [];
            if (control.length >= 1) {
                refreshContact2();
            }
            closeContact();
            popupSaveComplete();

            somePhoneNumerator = 0;
            someMailNumerator = 0;
            control = JSON.parse(localStorage.getItem('controlKey'));
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
