/***
 * DateSelector: Changes date/&time input with select box.
 * Value is set on the desired input, once complete date is set.
 * Version: 0.6
 * Last updated: 01.2014
 *
 * Copyright (c) 2014 eg81.es
 * http://eg81.es/dateSelector/
 */

(function($){

    $.fn.dateSelector = function( options ){

        

        /*
         * Default settings
         */
        var settings = $.extend(true, {
            // tag attributes (class, style, etc.)
            // { attr: value }
            /*
             * selected and class gets default settings value when not set on the selected input
             */
            inputName: 'dateselector',
            dateformat: 'H:i:s d-m-Y',              // (str) when in input date-value is not set, set default select order
            alertIncorrectDay: 'Select a correct day!', // (str) incorrect day alert message
            checkIncomplete: true,                  // (bool) check if all has been selected
            alertIncomplete: 'Date incomplete!',    // (str) incomplete alert message
            firstOptionClass: 'first-option',       // (str) first option class

            // date and time grouping with container
            dateContainerTag:       '',                // (str) default date container tag
            dateContainerClass:     '',        // (str) class for date selectors group
            dateContainerSeparator: true,           // (bool) when false prevents before and after time selector tag separators char
            timeContainerTag:       '',                // (str) default time container tag
            timeContainerClass:     '',        // (str) class for time selectors group
            timeContainerSeparator: true,           // (bool) when false prevents before and after time selector tag separators char


            // date&time select/options settings
            dayAttr: {
                selected :   0, // (int) selected day option position (default 0) [Range: 1-(28,29,30,31)]
                class:      '', // (str) select tag class attribute
                size:        1, // (int) viewed options (size attribute, such as multiple select list)
                blankTxt:   '', // (str) default text shown in blank option
                blankVal:   '', // (str) blank option default value
                beforeTag: '&nbsp;', // (mixed) before day select tag content (default &nbsp;)
                afterTag:   '&nbsp;'  // (mixed) after day select tag content (default &nbsp;-)
            },
            monthAttr: {
                selected :   0, // (int) selected month option position (default 0) [Range: 1-12]
                class:      '', // (str) select tag class attribute
                size:        1, // (int) viewed options (size attribute, such as multiple select list)
                blankTxt:   '', // (str) default text shown in blank option
                blankVal:   '', // (str) blank option default value
                names: {         // (object) month names
                    1: 'January',
                    2: 'February',
                    3: 'March',
                    4: 'April',
                    5: 'May',
                    6: 'June',
                    7: 'July',
                    8: 'August',
                    9: 'September',
                    10: 'October',
                    11: 'November',
                    12: 'December'
                },
                beforeTag: '&nbsp;', // (mixed) before month select tag content (default &nbsp;)
                afterTag:  '&nbsp;'  // (mixed) after month select tag content (default &nbsp;-)
            },
            yearAttr: {
                selected:    0, // (int) selected year option position (default 0) [Range: start-end year]
                class:      '', // (str) select tag class attribute
                size:        1, // (int) viewed options (size attribute, such as multiple select list)
                blankTxt:   '', // (str) default text shown in blank option
                blankVal:   '', // (str) blank option default value
                start: (new Date).getFullYear(),   // (int) start year (default current)
                end:   (new Date).getFullYear()+5,   // (int) end year (default current + 5)
                beforeTag: '&nbsp;', // (mixed) before year select tag content (default &nbsp;)
                afterTag:  '&nbsp;'  // (mixed) after year select tag content (default &nbsp;)
            },
            hourAttr: {
                selected: null,  // (str) selected hour option (default null) [Range: '00'-'24' as string]
                class:      '', // (str) select tag class attribute
                size:        1, // (int) viewed options (size attribute, such as multiple select list)
                blankTxt:   '', // (str) default text shown in blank option
                blankVal:   '', // (str) blank option default value
                beforeTag: '&nbsp;', // (mixed) before year select tag content (default &nbsp;)
                afterTag:   '&nbsp;',  // (mixed) after year select tag content (default &nbsp;:)
                factor:     '' // (str:[pair|odd]) if set get pair or odd hours
            },
            minAttr: {
                selected: null,  // (str) selected minutes option (default null) [Range: '00'-'59' as string]
                class:      '', // (str) select tag class attribute
                size:        1, // (int) viewed options (size attribute, such as multiple select list)
                blankTxt:   '', // (str) default text shown in blank option
                blankVal:   '', // (str) blank option default value
                beforeTag:  '&nbsp;', // (mixed) before year select tag content (default &nbsp;)
                afterTag:   '&nbsp;',  // (mixed) after year select tag content (default &nbsp;)
                factor:     '' // (str:[halb|fourth|pair|odd]) if set get halb, fourth, pair or odd minutes
            },
            secAttr: {
                selected: null,  // (str) selected seconds option (default null) [Range: '00'-'59' as string]
                class:      '', // (str) select tag class attribute
                size:        1, // (int) viewed options (size attribute, such as multiple select list)
                blankTxt:   '', // (str) default text shown in blank option
                blankVal:   '', // (str) blank option default value
                beforeTag: '&nbsp;', // (mixed) before year select tag content (default &nbsp;)
                afterTag:  '&nbsp;',  // (mixed) after year select tag content (default &nbsp;)
                factor:     '' // (str:[halb|fourth|pair|odd]) if set get halb, fourth, pair or odd minutes
            }
        }, options);


        /*
         * Creates day selectors options
         * @return container    string with generated options tags
         */
        $.fn.dateSelectorDayOptions = function(days)
        {
            var container = '';
            var selected;
            var blankTxt;
            var blankVal;

            // get default selected day
            selected = settings.dayAttr.selected;

            // get blank value/text
            blankTxt = settings.dayAttr.blankTxt;
            blankVal = settings.dayAttr.blankVal;

            for(i = 0; i <= days; i++)
            {
                var option  = '';
                var selAttr = (i == selected) ? ' selected ' : ' ';

                // adds ceros to an one digit number if ceroVal is true
                var valAttr = (i < 10) ? '0'+i : i;
                var txtAttr = (i < 10) ? '0'+i : i;

                // if first element (blank option) changes value and text
                if(i == 0)
                {
                    txtAttr = blankTxt;
                    valAttr = blankVal;
                    selAttr = ' class="' + settings.firstOptionClass + '" ' + selAttr + ' disabled=""';
                }
                
                option = '<option value="'+valAttr+'" '+selAttr+' >'+txtAttr+'</option>\n';

                container = container + option;
            }

            return container;
        }


        /*
         * Creates month selectors options
         * @return container    string with generated options tags
         */
        $.fn.dateSelectorMonthOptions = function()
        {
            var container = '';
            var selected;
            var blankTxt;
            var blankVal;

            // get default selected month
            selected = settings.monthAttr.selected;

            // get blank value/text
            blankTxt = settings.monthAttr.blankTxt;
            blankVal = settings.monthAttr.blankVal;

            for(i = 0; i <= 12; i++)
            {
                var option  = '';
                var selAttr = (i == selected) ? ' selected' : '';

                // get month value and correspond option text
                var valAttr = (i < 10) ? '0'+i : i;
                var txtAttr = settings.monthAttr.names[i];

                // if first element adds a blank option with default value and text
                if(i == 0)
                {
                    txtAttr = blankTxt;
                    valAttr = blankVal;
                    selAttr = ' class="' + settings.firstOptionClass + '"' + selAttr+' disabled=""';
                }
                option = '<option value="'+valAttr+'"'+selAttr+'>'+txtAttr+'</option>\n';
                container = container + option;
            }

            return container;
        }


        /*
         * Creates year selectors options
         * @return container    string with generated options tags
         */
        $.fn.dateSelectorYearOptions = function()
        {
            var container = '';
            var selected;
            var blankTxt;
            var blankVal;

            // get default selected year
            selected = settings.yearAttr.selected;

            // get blank value/text
            blankTxt = settings.yearAttr.blankTxt;
            blankVal = settings.yearAttr.blankVal;

            // get default start and end year
            startYear   = parseInt(settings.yearAttr.start);
            // when a year is selected, starts at selected year if it is previous than startYear
            if( selected != 0 & selected < startYear)
            {
                startYear = selected;
            }

            endYear     = parseInt(settings.yearAttr.end);
            // when a year is selected, ends at selected if it is later than end year
            if( selected != 0 & selected > endYear)
            {
                endYear = selected;
            }
            
            if(startYear > endYear){
                
                // i = current loop year
                for(i = startYear; i >= endYear; i--)
                {
                    var option  = '';
    
                    // option selected whose correspond with current loop year (i)
                    var selAttr = (i == selected) ? ' selected' : '';
    
                    // if first element adds a blank option with default value and text
                    if(i == startYear)
                    {
                        txtAttr = blankTxt;
                        valAttr = blankVal;
                        firstSelAttr = (selected == '' || typeof(selected) == 'undefined') ? ' class="' + settings.firstOptionClass + '" selected disabled="" ' : ' class="' + settings.firstOptionClass + '" disabled=""';
                        option = '<option value="'+valAttr+'"'+firstSelAttr+'>'+txtAttr+'</option>\n';
                        container = container + option;
                    }
    
                    // get year option value and text (i = current loop year)
                    var valAttr = i;
                    var txtAttr = i;
                    option = '<option value="'+valAttr+'"'+selAttr+'>'+txtAttr+'</option>\n';
                    container = container + option;
                }
                
            }else {

                // i = current loop year
                for(i = startYear; i <= endYear; i++)
                {
                    var option  = '';
    
                    // option selected whose correspond with current loop year (i)
                    var selAttr = (i == selected) ? ' selected' : '';
    
                    // if first element adds a blank option with default value and text
                    if(i == startYear)
                    {
                        txtAttr = blankTxt;
                        valAttr = blankVal;
                        firstSelAttr = (selected == '' || typeof(selected) == 'undefined') ? ' class="' + settings.firstOptionClass + '" selected' : ' class="' + settings.firstOptionClass + '"';
                        option = '<option value="'+valAttr+'"'+firstSelAttr+'>'+txtAttr+'</option>\n';
                        container = container + option;
                    }
    
                    // get year option value and text (i = current loop year)
                    var valAttr = i;
                    var txtAttr = i;
                    option = '<option value="'+valAttr+'"'+selAttr+'>'+txtAttr+'</option>\n';
                    container = container + option;
                }
            }

            return container;
        }


        /*
         * Builds Hour/minutes/seconds options
         * @param type (string:[hour|min|sec])  type of time would be created
         * @return container    string with generated options tags
         */
        $.fn.dateSelectorAddTimeOptions = function(type, factor)
        {
            var container = '';
            factor = (typeof(factor) == 'undefined') ? '' : factor;
            var time = 0;
            var attributes = '';
            var selected;
            var blankTxt;
            var blankVal;

            switch( (type).toLowerCase() )
            {
                case 'hour':
                    time = 23;   // last hour ['00'-'23'] as integer for loop
                    attributes = settings.hourAttr;
                    break;
                case 'min':
                    time = 59;  // last minute/second as integer for loop ['00'-'59']
                    attributes = settings.minAttr;
                    break;
                case 'sec':
                    time = 59;  // last minute/second as integer for loop ['00'-'59']
                    attributes = settings.secAttr;
                    break;
            }

            // get default selected day
            selected = attributes.selected;

            // get blank value/text
            blankTxt = attributes.blankTxt;
            blankVal = attributes.blankVal;

            // set fullTime var for factor calc
            var fullTime = time+1;

            // 24 hours starts at 00 to 59
            for(i = 0; i <= time; i++)
            {
                var option  = '';
                var selAttr = '';
                var addOption = false;

                // if first element (blank option) changes value and text
                if(i == 0)
                {
                    // selected first blank option when selected is no defined (null)
                    selAttr = (!selected) ? ' class="' + settings.firstOptionClass + '" selected' : ' class="' + settings.firstOptionClass + '"';
                    txtAttr = blankTxt;
                    valAttr = blankVal;
                    option = '<option value="'+valAttr+'"'+selAttr+'>'+txtAttr+'</option>\n';
                    container = container + option;

                }

                // adds option when a factor is set ande the loop corresponds to factored time
                addOption = (factor == '') ? true : addOption;
                addOption = (factor == 'halb' && (i == 0 || i == (fullTime/2) ) ) ? true : addOption;
                addOption = (factor == 'fourth' && (i== 0 || i == (fullTime/4) || i == (fullTime/2) || i == fullTime-(fullTime/4) ) ) ? true : addOption;
                // note: pair numbers % 2 = 0, odd numbers % 2 = 1
                addOption = (factor == 'pair' && (i%2 == 0) ) ? true : addOption;
                addOption = (factor == 'odd' && (i%2 == 1) ) ? true : addOption;

                // when addOption is true
                if(addOption)
                {
                    // adds ceros to an one digit number if ceroVal is true
                    var valAttr = (i < 10) ? '0'+i : i;
                    var txtAttr = (i < 10) ? '0'+i : i;
                    // selected option attribute when is a defined hour as string ['00'-'24']
                    selAttr = (selected == valAttr) ? ' selected' : '';

                    option = '<option value="'+valAttr+'"'+selAttr+'>'+txtAttr+'</option>\n';
                    container = container + option;
                }

            }

            return container;
        }
        
        
        return this.each(function() {
            
            // let selectedInput = this;
            let selectedInput = $( this );


            /*
             * Start of main operations
             *
             */
    
            // hides current input (type attribute would not be changed since it
            // can cause borwsers issues)
            selectedInput.css({
                'display':'none',
                'visibility':'hidden'
            });


            /*
             * Creates select tags in an array. Keys served to date format order
             * (H:i:s d-m-Y as default)
             */
            let dateSelect = new Array();

            // day selector
            // var daySelect
            dateSelect['d'] = $('<select />', {
                    id: 'dateselector_day'+selectedInput.attr('id'),
                    name: 'dateselector[day]',
                    size: settings.dayAttr.size
                })
                .addClass(settings.dayAttr.class);
    
            // month selector
            // var monthSelect
            dateSelect['m'] = $('<select />', {
                    id: 'dateselector_month'+selectedInput.attr('id'),
                    name: 'dateselector[month]',
                    size: settings.monthAttr.size
                })
                .addClass(settings.monthAttr.class);
    
            // year selector
            // var yearSelect
            dateSelect['y'] = $('<select />', {
                    id: 'dateselector_year'+selectedInput.attr('id'),
                    name: 'dateselector[year]',
                    size: settings.yearAttr.size
                })
                .addClass(settings.yearAttr.class);
    
            // hour selector
            // var hourSelect
            dateSelect['h'] = $('<select />', {
                    id: 'dateselector_hour',
                    name: 'dateselector[hour]',
                    size: settings.hourAttr.size
                })
                .addClass(settings.hourAttr.class);
    
            // minutes selector
            // var minSelect
            dateSelect['i']= $('<select />', {
                    id: 'dateselector_min',
                    name: 'dateselector[min]',
                    size: settings.minAttr.size
                })
                .addClass(settings.minAttr.class);
    
            // seconds selector
            // var secSelect
            dateSelect['s'] = $('<select />', {
                    id: 'dateselector_sec',
                    name: 'dateselector[sec]',
                    size: settings.secAttr.size
                })
                .addClass(settings.secAttr.class);
    
    
            /*
             * Add tabindex attribute if is set
             */
            var tabindex = selectedInput.attr('tabindex');
            if(tabindex)
            {
                dateSelect['d'].attr('tabindex', tabindex );
                dateSelect['m'].attr('tabindex', tabindex );
                dateSelect['y'].attr('tabindex', tabindex );
                dateSelect['h'].attr('tabindex', tabindex );
                dateSelect['i'].attr('tabindex', tabindex );
                dateSelect['s'].attr('tabindex', tabindex );
            }
    
            /*
             * Get date-value format or set default (H:i:s d-m-Y)
             *
             */
    
            // set defined date-value format or set from settings
            var dateformat = selectedInput.attr('date-value');
            dateformat = (dateformat) ? dateformat : settings.dateformat;
            dateformat = dateformat.toLowerCase();
            var orderedDateSelects = dateformat.replace(/\W/g, '').split('');
            var orderedSeparators = dateformat.replace(/\w/g, '').split('');
            orderedSeparators.push(false); // prevent last undefined
    
    
    
            // get and set input values if not set in settings (are defaults)
            var dateValue  = selectedInput.val();
            var orderedValue   = dateValue.match(/(\d+)/g);
    
            // set value as selected option
            if( dateValue != '' || typeof(dateValue) != 'undefined' )
            {
                for( k in orderedValue )
                {
                    switch(orderedDateSelects[k])
                    {
                        case 'd':
                            settings.dayAttr.selected = orderedValue[k];
                            break;
                        case 'm':
                            settings.monthAttr.selected = orderedValue[k];
                            break;
                        case 'y':
                            settings.yearAttr.selected = orderedValue[k];
                            break;
                        case 'h':
                            settings.hourAttr.selected = orderedValue[k];
                            break;
                        case 'i':
                            settings.minAttr.selected = orderedValue[k];
                            break;
                        case 's':
                            settings.secAttr.selected = orderedValue[k];
                            break;
                    }
                }
            }
    
    
    
            /*
             * Adds selectors options.
             */
            dateSelect['d'].html($.fn.dateSelectorDayOptions(31));
            dateSelect['m'].html($.fn.dateSelectorMonthOptions());
            dateSelect['y'].html($.fn.dateSelectorYearOptions());
            dateSelect['h'].html($.fn.dateSelectorAddTimeOptions('hour', settings.hourAttr.factor));
            dateSelect['i'].html($.fn.dateSelectorAddTimeOptions('min', settings.minAttr.factor));
            dateSelect['s'].html($.fn.dateSelectorAddTimeOptions('sec', settings.secAttr.factor));
    
    
            /*
             * Creates date and time container tags (for grouping).
             * Requires class and tag to be set.
             */
    
            // creates date container tags when class are set
            var dateContainerOpen = '';
            var dateContainerClose = '';
            if(settings.dateContainerClass != '' && settings.dateContainerTag != '')
            {
                dateContainerOpen = '<'+settings.dateContainerTag+' class="'+settings.dateContainerClass+'">';
                dateContainerClose = '</'+settings.dateContainerTag+'>';
            }
    
            // creates time container tags when class are set
            var timeContainerOpen = '';
            var timeContainerClose = '';
            if(settings.timeContainerClass != '' && settings.timeContainerTag != '')
            {
                timeContainerOpen = '<'+settings.timeContainerTag+' class="'+settings.timeContainerClass+'">';
                timeContainerClose = '</'+settings.timeContainerTag+'>';
            }
    
            /*
             * Compose all.
             * Add after selected input ('this' in this context) date selectors
             */
            var dateOpenedTag = false;  // date open tag controller
            var timeOpenedTag = false;  // time open tag controller
            var mountedContent = '';    // string with tags to add to the DOM
            for( k in orderedDateSelects )
            {
                var beforeTag = '';
                var afterTag  = '';
                var tag       = dateSelect[orderedDateSelects[k]];
                switch(orderedDateSelects[k])
                {
                    // dateContainerSeparator and timeContainerSeparator, when false, prevent add selector tags separator chars.
                    // NOTE: for 'd, m, y' are date and 'h, i, s' as time groups
                    case 'd':
                        beforeTag = (settings.dateContainerSeparator) ? settings.dayAttr.beforeTag : '';
                        afterTag  = (settings.dateContainerSeparator) ? settings.dayAttr.afterTag : '';
                        break;
                    case 'm':
                        beforeTag = (settings.dateContainerSeparator) ? settings.monthAttr.beforeTag : '';
                        afterTag  = (settings.dateContainerSeparator) ? settings.monthAttr.afterTag : '';
                        break;
                    case 'y':
                        beforeTag = (settings.dateContainerSeparator) ? settings.yearAttr.beforeTag : '';
                        afterTag  = (settings.dateContainerSeparator) ? settings.yearAttr.afterTag : '';
                        break;
                    case 'h':
                        beforeTag = (settings.timeContainerSeparator) ? settings.hourAttr.beforeTag : '';
                        afterTag  = (settings.timeContainerSeparator) ? settings.hourAttr.afterTag : '';
                        break;
                    case 'i':
                        beforeTag = (settings.timeContainerSeparator) ? settings.minAttr.beforeTag : '';
                        afterTag  = (settings.timeContainerSeparator) ? settings.minAttr.afterTag : '';
                        break;
                    case 's':
                        beforeTag = (settings.timeContainerSeparator) ? settings.secAttr.beforeTag : '';
                        afterTag  = (settings.timeContainerSeparator) ? settings.secAttr.afterTag : '';
                        break;
                }
    
                // if after tag separator are default values (&nbsp;) adds date-value (from input tag) format separator chars
                // preventing last undefined
                if(afterTag == '&nbsp;' && (typeof(orderedSeparators[k]) == 'string') )
                {
                    afterTag = afterTag + orderedSeparators[k];
                }
    
                /*
                    Adds open or close tag for date/time groups
                 */
                var openTag = '';
                var closeTag = '';
                var next = parseInt(k)+1;
    
                // if actual key is from data group and group tag is not opened
                if( orderedDateSelects[k] == 'd' || orderedDateSelects[k] == 'm' || orderedDateSelects[k] == 'y')
                {
                    // if opened tag is false, open it
                    if( !dateOpenedTag )
                    {
                        openTag = dateContainerOpen;
                        dateOpenedTag = true;
                    }
                }
                 // if next key is from data group and group tag is opened, do nothing (keep it open)
                // if next key is not from data group and group tag is opened, close it
                // prevent last undefined
                if( next < orderedDateSelects.length )
                {
                    if( !orderedDateSelects[next].match(/d|m|y/g) )
                    {
                        // and opened tag is true
                        if( dateOpenedTag )
                        {
                            closeTag = dateContainerClose;
                            dateOpenedTag = false;
                        }
                    }
                }
    
                 // do the same with time tags
                 // if actual key is from time group and group tag is not opened
                 if( orderedDateSelects[k] == 'h' || orderedDateSelects[k] == 'i' || orderedDateSelects[k] == 's')
                 {
                     // if opened tag is false, open it
                     if( !timeOpenedTag )
                     {
                         openTag = timeContainerOpen;
                         timeOpenedTag = true;
                     }
                 }
                 // if next key is from time group and group tag is opened, do nothing (keep it open)
                 // if next key is not from time group and group tag is opened, close it
                // prevent last undefined
                if(next < orderedDateSelects.length)
                {
                    if( !orderedDateSelects[next].match(/h|i|s/g) )
                    {
                        // and opened tag is true
                        if( timeOpenedTag )
                        {
                            closeTag = timeContainerClose + 'time';
                            timeOpenedTag = false;
                        }
                    }
                }
    
                // add to mount var
                mountedContent += openTag + beforeTag + tag.get(0).outerHTML + afterTag + closeTag;
            }
            // add to DOM
            selectedInput.parent().append(mountedContent);
    
    
            /*
             * On month change, adapt selectable days
             */
            $('#'+dateSelect['m'].attr('id')).change(function(e){
                e.preventDefault();
    
                // in this context 'this' is the month select tag whose would be aplyed the event listener
                // get month and year values
                var month = $(this).val();
                var year  = $( '#'+dateSelect['y'].attr('id') ).val();
    
                // calculate days in month
                var monthDays = new Date(0, month, 0).getDate();
                if( year != settings.yearAttr.blankVal )
                {
                    monthDays = new Date(year, month, 0).getDate();
                }
    
                // disable not used days
                $( '#' + $(dateSelect['d']).attr('id') + ' option').each(function(){
                    // 'this' (self) in this context is dataSelect['d'] option whose applied each function
                    if( $(this).val() > monthDays )
                    {
                        $(this).attr('disabled', true);
                    } else {
                        $(this).attr('disabled', false);
                    }
                });
    
                if( $('#' + dateSelect['d'].attr('id') + ' option:selected').attr('disabled') == 'disabled'  )
                {
                    alert( settings.alertIncorrectDay );
                }
    
                return false;
            }).change();
            
            
            $('#'+dateSelect['y'].attr('id')+', #'+dateSelect['d'].attr('id')+', #'+dateSelect['m'].attr('id')).on('change', function(e){
                let dVal = $('#'+dateSelect['d'].attr('id')).val();
                let mVal = $('#'+dateSelect['m'].attr('id')).val();
                let yVal = $('#'+dateSelect['y'].attr('id')).val(); 
                
                $(this).closest('.dateField').find('.error-info').addClass('hidden')
                
                if( (dVal !== '' && dVal !== null) && (mVal !== '' && mVal !== null) && (yVal !== '' && yVal !== null) ){
                    var allValid = true;
                    var allBlank = true;
                    var newValue = '';
                    var value = '';
                    var selValue = '';
    
                    // get and mount values
                    for( k in orderedDateSelects )
                    {
                        switch(orderedDateSelects[k])
                        {
                            case 'd':
                                selValue = $('#'+dateSelect['d'].attr('id')).val();
                                blank = ( selValue == settings.dayAttr.blankVal) ? true : false;
                                valid = ( selValue == settings.dayAttr.blankVal) ? false : true;
                                value = (orderedSeparators[k] !== false) ? selValue + orderedSeparators[k] : selValue;
                                break;
                            case 'm':
                                selValue = $('#'+dateSelect['m'].attr('id')).val();
                                blank = ( selValue == settings.monthAttr.blankVal) ? true : false;
                                valid = ( selValue == settings.monthAttr.blankVal) ? false : true;
                                value = (orderedSeparators[k] !== false) ? selValue + orderedSeparators[k] : selValue;
                                break;
                            case 'y':
                                selValue = $('#'+dateSelect['y'].attr('id')).val();
                                blank = ( selValue == settings.yearAttr.blankVal) ? true : false;
                                valid = ( selValue == settings.yearAttr.blankVal) ? false : true;
                                value = (orderedSeparators[k] !== false) ? selValue + orderedSeparators[k] : selValue;
                                break;
                            case 'h':
                                selValue = $('#'+dateSelect['h'].attr('id')).val();
                                blank = ( selValue == settings.hourAttr.blankVal) ? true : false;
                                valid = ( selValue == settings.hourAttr.blankVal) ? false : true;
                                value = (orderedSeparators[k] !== false) ? selValue + orderedSeparators[k] : selValue;
                                break;
                            case 'i':
                                selValue = $('#'+dateSelect['i'].attr('id')).val();
                                blank = ( selValue == settings.minAttr.blankVal) ? true : false;
                                valid = ( selValue == settings.minAttr.blankVal) ? false : true;
                                value = (orderedSeparators[k] !== false) ? selValue + orderedSeparators[k] : selValue;
                                break;
                            case 's':
                                selValue = $('#'+dateSelect['s'].attr('id')).val();
                                blank = ( selValue == settings.secAttr.blankVal) ? true : false;
                                valid = ( selValue == settings.secAttr.blankVal) ? false : true;
                                value = (orderedSeparators[k] !== false) ? selValue + orderedSeparators[k] : selValue;
                                break;
                        }
                        allValid = (allValid && valid );
                        allBlank = (allBlank && blank);
                        newValue = newValue + value;
                    }
                    
                    var inEl      = document.getElementById(selectedInput.attr('id'));
                    inEl.value    = newValue;
                    inEl.dispatchEvent(new Event('change'));
                }
            });
    
            /*
             * Form events handler:
             *  - on submit check values when proceed
             *  - on submit add mounted value to the input
             *  - on reset reset input value
             *
             */
            $(selectedInput).parents('form:first')
                .bind('reset', function(){
                    selectedInput.attr('value', dateValue);
                });
            
        // pk
        });
        // end plugin
        // return false
    }

}(jQuery));
