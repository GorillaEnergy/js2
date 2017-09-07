    let doc = window.document;
    let add = document.getElementById('add');
    let parent_block = doc.getElementById('parent_block');
    let main_block = doc.getElementById('main_block');
    let header = doc.getElementById('header');
    let search = doc.getElementById('search');
    let somePhoneNumerator = 1;
    let someMailNumerator = 1;

    //  ЗАГРУЗКА СПИСКА ИЗ localStorage ----------------------------------------------
    var control = JSON.parse(localStorage.getItem('controlKey'));
    window.onload = start();
    function start() {
        if (control !== null) {
         for ( let i = 0; i<control.length; i++) {
                let tmpi = control[i];
                let getls = JSON.parse(localStorage.getItem(tmpi));
                // console.log(getls);
                let addNewContact = doc.createElement('div');
                addNewContact.id = tmpi;
                addNewContact.innerHTML = '<div class="my-message"><p class="my-message-title">'+getls.lastname +' '+ getls.name +'</p></div>';
                parent_block.appendChild(addNewContact);
            }
        } else {
            console.log('End')
        }
    }

    //ДЕЙСТВИЯ ПО КНОПКЕ "ADD"--------------------------------------------------------
    //СОЗДАНИЕ МАКЕТА
    add.addEventListener('click', function () {
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
                    <input required placeholder="Name" class="input_zone" id="name" autofocus>\
                    <input required placeholder="Lastname" class="input_zone" id="lastname">\
                </div>\
                <div class="clearfix" id="inputPhone">\
                    <input type="tel" oninput="this.value = this.value.replace (/\\D/, \'\')" name="phone" class="input_zone" placeholder="Phone" id="phone">\
                    <button class="new_phone_mail" type="button" id="addPhone">+</button>\
                    <button class="new_phone_mail" type="button" id="removePhone">-</button>\
                </div>\
                <div class="clearfix" id="inputMail">\
                    <input type="email" name="mail" class="input_zone" placeholder="Mail" id="mail">\
                    <button class="new_phone_mail" type="button" id="addMail">+</button>\
                    <button class="new_phone_mail" type="button" id="removeMail">-</button>\
                </div>\
            </div>';
        header.appendChild(contactProfile);



        //ДЕЙСТВИЯ ПО КНОПКЕ "CLOSE"---------------------------------------
        let close = doc.getElementById('close');
        let closeW = doc.getElementById('newContact');
        let closeB = doc.getElementById('backing');
        close.addEventListener('click', function () {
            closeW.remove();
            closeB.remove();
        });

        //ДЕЙСТВИЯ ПО КНОПКЕ "SAVE"-----------------------------------------
        let save = doc.getElementById('save');
        save.addEventListener('click', function saveValue() {
            let name = document.getElementById("name").value;
            let lastname = document.getElementById("lastname").value;
            let phone = document.getElementById("phone").value;
            let mail = document.getElementById("mail").value;


            var tmparr = { name: name,
                           lastname: lastname,
                           phone: [phone],
                           mail: [mail]
                         };

            if (somePhoneNumerator !== 1) {
                for (let j=2; j<=somePhoneNumerator; j++) {
                    let tmpArrPhone = doc.getElementById("Phone" + j).value;
                    if (tmpArrPhone !== '') {
                        tmparr.phone.push(tmpArrPhone);
                    }
                }
            }
            somePhoneNumerator = 1;

            if (someMailNumerator !== 1) {
                for (let k=2; k<=someMailNumerator; k++) {
                    let tmpArrMail = doc.getElementById("Mail" + k).value;
                    if (tmpArrMail !== '') {
                        tmparr.mail.push(tmpArrMail);
                    }
                }
            }
            someMailNumerator = 1;

            // console.log(name, lastname, phone);
            //Условия для сохранения данных(Валидность(наверное...))
                //Подсказка на незаполненное поле
            if (name == ''){
                doc.getElementById('name').style.backgroundColor = '#f1bdbd';
            } else {
                doc.getElementById('name').style.backgroundColor = 'white';
            };
            if (lastname == ''){
                doc.getElementById('lastname').style.backgroundColor = '#f1bdbd'
            } else {
                doc.getElementById('lastname').style.backgroundColor = 'white';
            };
            if (phone == ''){
                doc.getElementById('phone').style.backgroundColor = '#f1bdbd';
            } else {
                doc.getElementById('phone').style.backgroundColor = 'white';
            };

            //Собственно само условие!
            if (name !== '' && lastname !== '' && phone !== '') {

            // значение нового ключа в controlKey
            let arrcontrolKey = JSON.parse(localStorage.getItem('controlKey'));
            if (arrcontrolKey !== null) {
                var newCK = arrcontrolKey[arrcontrolKey.length - 1] + 1;  //ключ -> значение +1
            } else {
                 newCK = 0;
            }

            //Перезапись проверочного ключа(в localStorage) ControlKey
            if (arrcontrolKey !== null) {
            localStorage.setItem(newCK, JSON.stringify(tmparr));  //записываем новый объект в lS с ключем +1
            var tmpCK = JSON.parse(localStorage.getItem('controlKey')); //вытаскиваем CK из lS
            tmpCK.push(newCK); //пушим новое значение в массив
            localStorage.setItem('controlKey', JSON.stringify(tmpCK)); // записываем новый CK в lS
            } else {
                nullCK =[0];
                localStorage.setItem('controlKey', JSON.stringify(nullCK));
                localStorage.setItem('0', JSON.stringify(tmparr));
            }

            //Запись нового контакта
            var addNewContact = doc.createElement('div');
            tmpCK = JSON.parse(localStorage.getItem('controlKey'));
            // console.log(tmpCK);
            if (tmpCK.length>1){
            addNewContact.id = tmpCK.length-1;
            } else {
                addNewContact.id = 0;
            }
            addNewContact.innerHTML = '<div class="my-message"><span class="my-message-title">'+tmparr.lastname +' '+ tmparr.name +'</span></div>';
            parent_block.appendChild(addNewContact);
            closeW.remove();
            closeB.remove();
            location.reload()  // перезагрузка страницы(увы без етого параметра не открывает контакт)
            };
        });

        //Действия кнопки [+] Phone
        let inputPhone = doc.getElementById('inputPhone');
        let addPhone = doc.getElementById('addPhone');
        addPhone.addEventListener('click', function () {
            somePhoneNumerator++;
            let somePhone = "Phone" + somePhoneNumerator;
            // console.log(somePhone);

            let newInput = doc.createElement('input');
            newInput.id = somePhone;
            newInput.placeholder = somePhone;
            newInput.className = 'input_zone';
            newInput.oninput = function () {this.value = this.value.replace (/\D/, '')};
            newInput.innerHTML = '<input type="tel" name="phone">';
            inputPhone.appendChild(newInput);
        });

        //Действия кнопки [-] Phone
        let removePhone = doc.getElementById('removePhone');
        removePhone.addEventListener('click', function () {
            if (somePhoneNumerator>1){
            // console.log(somePhoneNumerator);
            let tmpRemovePhone = doc.getElementById("Phone"+somePhoneNumerator);
            tmpRemovePhone.remove();
            somePhoneNumerator--;
            }
        });

        //Действия кнопки [+] Mail
        let inputMail = doc.getElementById('inputMail');
        let addMail = doc.getElementById('addMail');
        addMail.addEventListener('click', function () {
            someMailNumerator++;
            let someMail = "Mail" + someMailNumerator;
            // console.log(someMail);

            let newInput = doc.createElement('input');
            newInput.id = someMail;
            newInput.placeholder = someMail;
            newInput.className = 'input_zone';
            newInput.innerHTML = '<input type="email" name="mail">';
            inputMail.appendChild(newInput);
        });

        //Действия кнопки [-] Mail
        let removeMail = doc.getElementById('removeMail');
        removeMail.addEventListener('click', function () {
            if (someMailNumerator>1){
                // console.log(someMailNumerator);
                let tmpRemoveMail = doc.getElementById("Mail"+someMailNumerator);
                tmpRemoveMail.remove();
                someMailNumerator--;
            }
        });
    });

    //ДЕЙСТВИЯ ПО НАЖАТИЮ НА КОНТАКТ
    // console.log(control);
    if (control !== null) {
        for ( let m=0; m<control.length; m++) {
            let tmpCallBlock = control[m];  //controlKey[i]
            let tmpID = doc.getElementById(tmpCallBlock);  //id тот же что и controlKey[i]
            let tmpCount = m;
            tmpID.addEventListener('click', function () {
                var tmpArrReCall = JSON.parse(localStorage.getItem(tmpCallBlock));

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
                </div>'
                header.appendChild(contactProfileButtonZone);

                //NameZone
                var nameZone = doc.getElementById('nameZone');
                var contactProfileNameZone = doc.createElement('input');
                contactProfileNameZone.value = tmpArrReCall.name;
                contactProfileNameZone.className = 'input_zone';
                contactProfileNameZone.id = 'name';
                contactProfileNameZone.placeholder = 'Name';
                contactProfileNameZone.innerHTML = '<input>';
                nameZone.appendChild(contactProfileNameZone);

                //LastnameZone
                var lastnameZone = doc.getElementById('nameZone');
                var contactProfileLastnameZone = doc.createElement('input');
                contactProfileLastnameZone.value = tmpArrReCall.lastname;
                contactProfileLastnameZone.className = 'input_zone';
                contactProfileLastnameZone.id = 'lastname';
                contactProfileLastnameZone.placeholder = 'Lastame';
                contactProfileLastnameZone.innerHTML = '<input>';
                lastnameZone.appendChild(contactProfileLastnameZone);

                //PhoneZone
                var phoneLegth = tmpArrReCall.phone.length;
                //Первое(дефолтное поле ввода)
                var inputPhone = doc.getElementById('inputPhone');
                var firsPhone = doc.createElement('input');
                firsPhone.value = tmpArrReCall.phone[0];
                firsPhone.id = 'phone';
                firsPhone.className = 'input_zone';
                firsPhone.placeholder = 'Phone';
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
                if (phoneLegth > 1) {
                    for (var i=1; i<phoneLegth; i++) {
                        var anothetPhone = doc.createElement('input');
                        anothetPhone.className = 'input_zone';
                        anothetPhone.value = tmpArrReCall.phone[i];
                        anothetPhone.id = 'phone' + (i+1);
                        anothetPhone.placeholder = 'Phone'+ (i+1);
                        anothetPhone.oninput = function () {this.value = this.value.replace (/\D/, '')};
                        anothetPhone.innerHTML = '<input type="tel" name="phone">';
                        inputPhone.appendChild(anothetPhone);
                    }
                }

                //MailZone
                let mailLegth = tmpArrReCall.mail.length;
                //Первое(дефолтное поле ввода)
                let inputMail = doc.getElementById('inputMail');
                let firsMail = doc.createElement('input');
                firsMail.value = tmpArrReCall.mail[0];
                firsMail.id = 'mail';
                firsMail.className = 'input_zone';
                firsMail.placeholder = 'Mail';
                firsMail.innerHTML = '<input type="email" name="mail">';
                inputMail.appendChild(firsMail);
                //ButtonZone
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

                //Добавление остальных номеров
                if (mailLegth > 1) {
                    for (let i=1; i<mailLegth; i++) {
                        let anothetMail = doc.createElement('input');
                        anothetMail.className = 'input_zone';
                        anothetMail.value = tmpArrReCall.mail[i];
                        anothetMail.id = 'mail' + (i+1);
                        anothetMail.placeholder = 'Mail'+ (i+1);
                        anothetMail.innerHTML = '<input type="email" name="mail">';
                        inputMail.appendChild(anothetMail);
                    }

                }

            //    РАЗНЫЕ КНОПОЧКИ
                //ДЕЙСТВИЯ ПО КНОПКЕ "CLOSE"---------------------------------------
                let close = doc.getElementById('close');
                let closeW = doc.getElementById('newContact');
                let closeB = doc.getElementById('backing');
                close.addEventListener('click', function () {
                    closeW.remove();
                    closeB.remove();
                });

                //ДЕЙСТВИЯ ПО КНОПКЕ "SAVE"-----------------------------------------
                let save = doc.getElementById('save');
                save.addEventListener('click', function saveValue() {
                    let name = document.getElementById("name").value;
                    let lastname = document.getElementById("lastname").value;
                    let phone = document.getElementById("phone").value;
                    let mail = document.getElementById("mail").value;


                    let tmparr = { name: name,
                        lastname: lastname,
                        phone: [phone],
                        mail: [mail]
                    };

                    let PhoneNumerator = SomePhoneNumerator2;
                    if (PhoneNumerator > 1) {
                        for (var i=2; i<=PhoneNumerator; i++) {
                            var tmpPhone = doc.getElementById("phone" + i).value;
                            if (tmpPhone !== '') {
                                tmparr.phone.push(tmpPhone);
                            }
                        }
                    }

                    let MailNumerator = SomeMailNumerator2;
                    if (MailNumerator > 1) {
                        for (var i=2; i<=MailNumerator; i++) {
                            var tmpMail = doc.getElementById("mail" + i).value;
                            if (tmpMail !== '') {
                                tmparr.mail.push(tmpMail);
                            }
                        }
                    }

                    //Условие для сохранения
                        //Подсказка на незаполненное поле
                    if (name == ''){
                        doc.getElementById('name').style.backgroundColor = '#f1bdbd';
                    } else {
                        doc.getElementById('name').style.backgroundColor = 'white';
                    };
                    if (lastname == ''){
                        doc.getElementById('lastname').style.backgroundColor = '#f1bdbd'
                    } else {
                        doc.getElementById('lastname').style.backgroundColor = 'white';
                    };
                    if (phone == ''){
                        doc.getElementById('phone').style.backgroundColor = '#f1bdbd';
                    } else {
                        doc.getElementById('phone').style.backgroundColor = 'white';
                    };

                    //Собственно само условие!
                    if (name !== '' && lastname !== '' && phone !== '') {

                        //Перезапись ключа в localStorage
                        localStorage.setItem(tmpCallBlock, JSON.stringify(tmparr));

                        //Перезапись контакта в parent_block
                        tmpID.remove(); //удаление старого контакта из parent_block
                        let addNewContact = doc.createElement('div');   // добавляем обновленные данные
                        addNewContact.innerHTML = '<div class="my-message"><span class="my-message-title">' + tmparr.lastname + ' ' + tmparr.name + '</span></div>';
                        parent_block.appendChild(addNewContact);
                        closeW.remove(); //закрытие окна контакта
                        closeB.remove();
                        location.reload()  // перезагрузка страницы(увы без етого параметра не открывает контакт)
                    };
                });

                //ДЕЙСТВИЯ ПО КНОПКЕ "DELETE"--------------------------------------
                let deleteContact = doc.getElementById('del');
                deleteContact.addEventListener('click', function () {
                    localStorage.removeItem(tmpCallBlock);
                    let tmpCK = JSON.parse(localStorage.getItem('controlKey'));
                        // console.log('Массив из lS controlKey ['+tmpCK +']');
                    tmpCK.splice(tmpCount, 1);  //удаляем элемент массива
                        // console.log('Удаляемый элемент '+tmpCallBlock);
                        // console.log('Массив после удаления элемента ['+tmpCK+']');
                        // console.log('Длина массива '+tmpCK.length);
                    localStorage.setItem('controlKey', JSON.stringify(tmpCK));
                    // if (tmpCK.length === 1) {
                    //     localStorage.removeItem("controlKey");
                    //         console.log('ControlKey removed');
                    // };

                    let child = doc.getElementById(tmpCallBlock);
                    parent_block.removeChild(child);
                    closeW.remove();
                    closeB.remove();
                });

                //ДЕЙСТВИЯ ПО КНОПКЕ [+] Phone
                let addPhone = doc.getElementById('addPhone');
                let SomePhoneNumerator2 = tmpArrReCall.phone.length;
                addPhone.addEventListener('click', function () {
                    SomePhoneNumerator2++;
                    let somePhone = "phone" + SomePhoneNumerator2;
                    // console.log(somePhone);

                    let newInput = doc.createElement('input');
                    newInput.id = somePhone;
                    newInput.placeholder = somePhone;
                    newInput.className = 'input_zone';
                    newInput.oninput = function () {this.value = this.value.replace (/\D/, '')};    //------------------------------
                    newInput.innerHTML = '<input type="tel" name="phone">';
                    inputPhone.appendChild(newInput);
                });

                //ДЕЙСТВИЯ ПО КНОПКЕ [-] Phone
                let removePhone = doc.getElementById('removePhone');
                removePhone.addEventListener('click', function () {
                    if (SomePhoneNumerator2>1){
                        // console.log(SomePhoneNumerator2);
                        let tmpRemovePhone = doc.getElementById("phone"+SomePhoneNumerator2);
                        tmpRemovePhone.remove();
                        SomePhoneNumerator2--;
                    }
                });

                //Действия кнопки [+] Mail
                let addMail = doc.getElementById('addMail');
                let SomeMailNumerator2 = tmpArrReCall.mail.length;
                addMail.addEventListener('click', function () {
                    SomeMailNumerator2++;
                    let someMail = "mail" + SomeMailNumerator2;
                    // console.log(someMail);

                    let newInput = doc.createElement('input');
                    newInput.id = someMail;
                    newInput.placeholder = someMail;
                    newInput.className = 'input_zone';
                    newInput.innerHTML = '<input type="email" name="mail">';
                    inputMail.appendChild(newInput);
                });

                //Действия кнопки [-] Mail
                let removeMail = doc.getElementById('removeMail');
                removeMail.addEventListener('click', function () {
                    if (SomeMailNumerator2 > 1) {
                        // console.log(SomeMailNumerator2);
                        let tmpRemoveMail = doc.getElementById("mail" + SomeMailNumerator2);
                        tmpRemoveMail.remove();
                        SomeMailNumerator2--;
                    }
                });
            })
        }
    }

    // ПОИСК
    search.addEventListener("input", function () {
        for (var i = 0; i<control.length; i++){
            let blockContent = doc.getElementById(control[i]).innerText;
            doc.getElementById(control[i]).style.display = '';
            if (blockContent.toLowerCase().indexOf(search.value.toLowerCase()) === -1){
                doc.getElementById(control[i]).style.display = 'none';
            }
        }
    });