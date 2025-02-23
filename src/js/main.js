// initial form hidden inputs
document.addEventListener("DOMContentLoaded", function(){
    // catching values from url params
    var device = platform.os + (platform.manufacturer ? ' ' + platform.manufacturer : '') + (platform.product ? ' ' + platform.product : '');
    var affid = getSearchParams('affid');
    var transaction_id = getSearchParams('externalid');
    var clickId = getSearchParams('clickId') ?? (getSearchParams('cid') ?? getSearchParams('click_id'));
    var list_id = getSearchParams('list_id');
    var ph = getSearchParams('ph');
    var bread = getSearchParams('bread');
    var fbclid = getSearchParams('fbclid');

    if (affid)
        document.querySelector('#affid').value = affid

    if (bread)
        document.querySelector('#bread').value = bread

    if (transaction_id)
        document.querySelector('#transaction_id').value = transaction_id

    if (list_id)
        document.querySelector('#list_id').value = list_id

    if (device)
        document.querySelector('#device').value = device

    if (clickId)
        document.querySelector('#clickId').value = clickId

    if (ph)
        document.querySelector('#ph').value = ph

    if (fbclid)
        document.querySelector('#fbclid').value = fbclid
});

function getSearchParams(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
}

function ipinfos() {
    var city = '';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://pro.ip-api.com/json?key=uDBlDLE4QL19zpt', true);
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            document.getElementById('zip_code').value = data.zip;
            document.getElementById('city').value = data.city;
            document.getElementById('state').value = data.region;

            if (typeof data.city != "undefined" || data.city != null || data.city != "") {
                $(".cityName").html("OF " + data.city.toUpperCase());
            }
        } else {
            console.error(xhr.statusText);
        }
    };
    xhr.onerror = function () {
        console.error(xhr.statusText);
    };
    xhr.send(null);
}

ipinfos()



// Document Ready
$(document).ready(function(){
    // initialize the all input select
    $('.input_select').select2();

    // scroll to target
    $('.scroll-btn').on('click', function(){
        $('html, body').animate({
            scrollTop: $('#main-form').offset().top - 50
        }, 50);
    })

    // utility function
    function isSelected(radioButtons) {
        for (let i = 0; i < radioButtons.length; i++) {
            if (radioButtons[i].checked) {
                return true;
            }
        }
        return false;
    }

    function isValidEmail(email) {
        let emailRegx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegx.test(email)) { // check if email has at least one . character after @
            return false;
        }
        return true;
    }

    function isValidPhone(phone) {
        let re = /^(1\s)?(\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/;
        return re.test(phone);
    }

    function showError(input, is_radio = false){
        let element = input;
        $(element).addClass('border-red');

        $(element).parent().find('.error-info').length > 0 ? $(element).parent().find('.error-info').removeClass('hidden') : $(element).parent().parent().find('.error-info').removeClass('hidden');
    }

    function scrollToFirstError(selector) {
        //scroll to specific div
        document.querySelector(selector).scrollIntoView({
            behavior: 'smooth'
        });
    }

    function scrollToElement(selector){
         //scroll to specific div
         document.querySelector(selector).scrollIntoView({
            behavior: 'smooth'
        });
    }

    function clearErrorOnInputChange() {
        let radioButtons = $('input[type="radio"], input[type="checkbox"]');
        let inputs = $('input[type="text"], input[type="email"], input[type="number"], textarea');
        
        // remove error class
        radioButtons.each((index, radio) => {
            $(radio).change(function(){
                let parent = $(this).parent().parent();
                if(!$(parent).find('.error-info').hasClass('hidden')) $(parent).find('.error-info').addClass('hidden');
            })
        })

        inputs.each((index, input) => {
            $(input).keypress(function(){
                let parent = $(this).parent().parent();
                if(!$(parent).find('.error-info').hasClass('hidden')) $(parent).find('.error-info').addClass('hidden');
            })
        })

        $('select').on('select2:select', function (e) {
            let parent = $(this).parent();
            if(!$(parent).find('.error-info').hasClass('hidden')) $(parent).find('.error-info').addClass('hidden');
        })
    }

    clearErrorOnInputChange();

    function validateForm(){

        // radios
        let exposedRadioButtons = document.querySelectorAll('input[name="exposed"]');
        let attorney = document.querySelectorAll('input[name="attorney"]');

        // Select
        let exposed_duration = document.querySelector('select[name="exposed_duration"]');
        let occasions_exposed = document.querySelector('select[name="occasions_exposed"]');
        let occupation_exposed = document.querySelector('select[name="occupation_exposed"]');
        let exposed_to_afff_in_military = document.querySelector('select[name="exposed_to_afff_in_military"]');
        let injury = document.querySelector('select[name="injury"]');

        // inputs
        let firstNameField = document.querySelector('input[name="first_name"]');
        let lastNameField = document.querySelector('input[name="last_name"]');
        let emailField = document.querySelector('input[name="email"]');
        let phoneField = document.querySelector('input[name="phone"]');
        let leadid_tcpa_disclosureField = document.querySelector('input[name="leadid_tcpa_disclosure"]');

        // initialize the validation status are true
        let isValid = true;

        if (!isSelected(exposedRadioButtons)) {
            showError(exposedRadioButtons, true);
            isValid = false;
        }

        if (!isSelected(attorney)) {
            showError(attorney, true);
            isValid = false;
        }

        if (exposed_duration.value.trim() === '') {
            showError(exposed_duration);
            isValid = false;
        }

        if (occasions_exposed.value.trim() === '') {
            showError(occasions_exposed);
            isValid = false;
        }

        if (occupation_exposed.value.trim() === '') {
            showError(occupation_exposed);
            isValid = false;
        }

        if (exposed_to_afff_in_military.value.trim() === '') {
            showError(exposed_to_afff_in_military);
            isValid = false;
        }

        if (injury.value.trim() === '') {
            showError(injury);
            isValid = false;
        }

        if (firstNameField.value.trim() === '') {
            showError(firstNameField);
            isValid = false;
        }

        if (lastNameField.value.trim() === '') {
            showError(lastNameField);
            isValid = false;
        }

        if (!isValidEmail(emailField.value)) {
            showError(emailField);
            isValid = false;
        }

        if (!isValidPhone(phoneField.value)) {
            showError(phoneField);
            isValid = false;
        }

        if(!leadid_tcpa_disclosureField.checked) {
            showError(leadid_tcpa_disclosureField);
            isValid = false;
        }

        return isValid; // return the validation status
    }

    // Form Validation
    let mainForm = $('#signup_form');

    // fire submit event
    $(mainForm).on('submit', function(e){
        // prevent the form submitting
        e.preventDefault();

        if(!validateForm()){
            scrollToFirstError('.error-info:not(.hidden)');
            return
        };

        // if pass the validation, submit the form

        $('#signup_form').addClass('button-loading');
        $('#signup_form input[type="submit"]').attr('disabled', true);
        
        $('input[name="disclaimerText"]').val(document.querySelector('.leadid_tcpa_disclosure').textContent.replace(/\s+/g, ' ').trim())

        // start building the form data
        const generalDataInputs = $('.general_data input');
        const userDataInputs = $(this).find('input:not([type="submit"]), select, textarea');
        const formData = new FormData();
        const seenKeys = {}; // Object to track encountered keys

        // Append general form data to FormData with duplicate check
        generalDataInputs.each((index, input) => {
            const key = input.name;
            if (!seenKeys.hasOwnProperty(key)) {
                formData.append(key, input.value);
                seenKeys[key] = true; // Mark key as seen
            }
        });

        // Append user data with duplicate check
        userDataInputs.each((index, input) => {
            const key = input.name;
            if (!seenKeys.hasOwnProperty(key)) {
                if (input.type === 'radio') {
                    if (input.checked) {
                    formData.append(key, input.value);
                    seenKeys[key] = true;
                    }
                } else {
                    formData.append(key, input.value);
                    seenKeys[key] = true;
                }
            }
        });


        //fire form submitted events
        document.dispatchEvent(new Event('form_signup'));
        dataLayer.push({'event': 'ga_form_signup'});

        $.ajax({
            method: 'POST',
            url: "sendmail.php",
            data: formData,
            dataType: 'json',
            processData: false, // Prevent jQuery from processing the data
            contentType: false, // Let the browser set the appropriate content type

            success: function (data) {
                if (data.status == "success") {
                    window.location.href = data.url;
                }
                if(data.status == 'error') {
                    showError(document.querySelector('input[name="phone"]'))
                }
                $('#signup_form').removeClass('button-loading');
                $('#signup_form input[type="submit"]').attr('disabled', false);
                $('.response-error').removeClass('hidden');
            }, error: function (data) {
                $('#signup_form').removeClass('button-loading');
                $('#signup_form input[type="submit"]').attr('disabled', false);
                $('.response-error').removeClass('hidden')
            }
        })
    })

})