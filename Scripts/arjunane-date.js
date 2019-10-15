(function (factory) {
    if (typeof define === "function" && define.amd) {

        // AMD. Register as an anonymous module.
        define(["jquery", "./version"], factory);
    } else {

        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    //menerapkan default pada tanggal
    var dt = new Date();
    //helper di ini untuk me-validasi parameters
    const HELPER =
    {
        formatDate: [
            "mm-dd-yyyy", // bulan-hari-tahun
            "mm-yyyy-dd", // bulan-tahun-hari
            "dd-mm-yyyy", // hari-bulan-tahun
            "dd-yyyy-mm", // hari-tahun-bulan
            "yyyy-mm-dd", // tahun-bulan-hari
            "yyyy-dd-mm", // tahun-hari-bulan

            "mm.dd.yyyy", // bulan.hari.tahun
            "mm.yyyy.dd", // bulan.tahun.hari
            "dd.mm.yyyy", // hari.bulan.tahun
            "dd.yyyy.mm", // hari.tahun.bulan
            "yyyy.mm.dd", // tahun.bulan.hari
            "yyyy.dd.mm", // tahun.hari.bulan


            "mm/dd/yyyy", // bulan/hari/tahun
            "mm/yyyy/dd", // bulan/tahun/hari
            "dd/mm/yyyy", // hari/bulan/tahun
            "dd/yyyy/mm", // hari/tahun/bulan
            "yyyy/mm/dd", // tahun/bulan/hari
            "yyyy/dd/mm", // tahun/hari/bulan
        ],
        formatTime: [
            "hh:mm:ss:ms",
            "hh:mm:ss",
            "hh:mm",
            "hh"
        ],
        cls: [
            "arjunane-date",                            // 0.
            ".arjunane-date",                           // 1.
            ".arjunane-date *",                         // 2. target !==
            "._date-header-center.month",               // 3. button bulan (memiih bulan)
            "._date-header-center.year ",               // 4. button bulan (memiih bulan)
            "._date-option._month",                     // 5. opsi bulan
            "._date-option._year",                      // 6. opsi tahun
            "._date-option._month input",               // 7. input opsi bulan
            "._date-option._year input",                // 8. input opsi tahun
            "._date-option._month .month",              // 9. data opsi bulan
            "._date-option._year .year",                // 10. data opsi tahun
            "._date-header ._date-header-left",         // 11. button kiri ganti bulan/tahun
            "._date-header ._date-header-right",        // 12. button kanan ganti bulan/tahun
            "._date-body.full-day",                     // 13. Full Date (day) 1 - 31 (Wadah)
            "._date-body ._date-container",             // 14. Full Date (day) 1 - 31 (isinya || inner)
            "._date-body ._date-inner .days",           // 15. Mendapatkan tanggal yang ter-klik
            "._date-time ._time-up" ,                   // 16. Button panah atas ganti waktu 
            "._date-time ._time-down",                  // 17. Button panah bawah ganti waktu 
            "._date-time .__button-time"                // 18. Button time
        ], //nama class css || 1. tanpa ".", 2. dengan "."
        click: "click",
        input: "input"
    },
        DEFAULT =
        {
            daysName  : [
                ["Minggu", "Min"], ['Senin', "Sen"], ["Selasa", "Sel"], ["Rabu", "Rab"], ["Kamis", "Kam"], ["Jumt'at", "Jum"], ["Sabtu", "Sab"]
            ], //memberikan nama hari beserta singkatan nya
            monthsName: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"], //memberikan nama semua bulan
            rangeYears: (dt.getFullYear() - 1) + ":" + dt.getFullYear(), //menerapkan tahun saat ini untuk pemilihan tahun awal sampai akhir
            formatDate: "mm-dd-yyyy", //menerapkan default pemilihan tanggal, dimana tanggal di awali "bulan-hari-tahun"
            formatTime: "hh:mm:ss", //menerapkan bahwa pemilihan waktu || jam:menit:detik
            attr      : "value", //pemilihan berdasarkan attribute sebagai default
            holiday   : [
                ["01-16-2018", "Hari Raya Imlek"],
                ["02-17-2018", "Hari Raya Nyepi"],
                ["02-30-2018", "Paskah (Jum'at Agung)"],
                ["03-14-2018", "Isra Mi'raj"],
                ["04-10-2018", "Kenaikan Yesus"],
                ["04-29-2018", "Hari Raya Waisak"],
                ["05-11-2018_05-14-2018", "Cuti Bersama Lebaran"],
                ["05-15-2018_05-16-2018", "Hari Raya Idul Fitri"],
                ["05-18-2018_05-20-2018", "Cuti Bersama Lebaran"],
                ["05-27-2018", "Hari Pencoblosan Pilkada Serentak"],
                ["07-22-2018", "Idul Adha"],
                ["08-11-2018", "Tahun Baru Islam"],
                ["10-20-2018", "Maulid Nabi Muhammad SAW"],
                ["11-24-2018", "Cuti Bersama Hari Raya Natal"],
            ], //hari raya dimana mm-dd-yyyy
            permanentHolidays: [
                ["00-01", "Tahun Baru"],
                ["04-01", "Hari Buruh"],
                ["07-17", "Hari Kemerdekaan Indonesia"],
                ["05-01", "Hari Lahir Pancasila"],
                ["11-25", "Hari Raya Natal"]
            ],
            multiSetDate : false,
            showDate  : [ true, false ], // show di sini untuk menampilkan tanggal (body tanggal dan body waktu)
            minutes   : "0-60",
            hours     : "0-24"
        };

    $.fn.tanggal = function (e, handler)
    {
        //jika $(document).tanggal('nama element', {});
        var body  = $("body"),
            aktif = "aktif",
            none  = "none";
        
        var _controller = function ()
        {
            this.elem        = null;
            this.btnMonth    = null;
            this.btnYear     = null;
            this.optionYear  = null;
            this.optionMonth = null;
            this.inputMonth  = null;
            this.inputYear   = null;
            this.months      = null;
            this.years       = null;
            this.btnLeft     = null;
            this.btnRight    = null;
            this.dateBody    = null;
            this.index       = null;
        };

        // mendapatkan element arjunane-date yang sudah di append
        _controller.prototype.getElement = function (elem)
        {
            this.elem = elem;
            return this;
        };

        // ekstrak semua element yang terkait pada arjunane-date
        _controller.prototype.findAll = function ()
        {
            var btnMonth        = this.elem.find(HELPER.cls[3]),
                btnYear         = this.elem.find(HELPER.cls[4]),
                option_month    = this.elem.find(HELPER.cls[5]),
                option_year     = this.elem.find(HELPER.cls[6]),
                input_month     = this.elem.find(HELPER.cls[7]),
                input_year      = this.elem.find(HELPER.cls[8]),
                months          = this.elem.find(HELPER.cls[9]),
                years           = this.elem.find(HELPER.cls[10]),
                btn_left        = this.elem.find(HELPER.cls[11]),
                btn_right       = this.elem.find(HELPER.cls[12]),
                date_body       = this.elem.find(HELPER.cls[13]),
                day             = this.elem.find(HELPER.cls[15]),
                btnTimeUp       = this.elem.find(HELPER.cls[16]),
                btnTimeDown     = this.elem.find(HELPER.cls[17]);
            this.btnMonth    = btnMonth; // button bulan
            this.btnYear     = btnYear; // button tahun
            this.optionMonth = option_month; // wadah option bulan
            this.optionYear  = option_year; // wadah option tahun
            this.inputMonth  = input_month; // input nama bulan
            this.inputYear   = input_year; // input tahun
            this.months      = months; // pilihan bulan [januari - desember]
            this.years       = years; // pilihan tahun [19xx - 20xx]
            this.btnLeft     = btn_left; // button left / kiri
            this.btnRight    = btn_right; // button right / kanan
            this.dateBody    = date_body; // body full-day
            this.btnTimeUp   = btnTimeUp; // button atas ganti waktu
            this.btnTimeDown = btnTimeDown; // button bawah ganti waktu
            this.day         = day;
            return this;
        };

        // click button bulan dan tahun
        _controller.prototype.selectOption = function ()
        { 
            var months      = this.months,
                years       = this.years,
                optionMonth = this.optionMonth,
                optionYear  = this.optionYear;
            // pilihan bulan ter-klik
            months.on(HELPER.click, function () { 
                var ini = $(this);
                if (!ini.hasClass(aktif))
                { 
                    optionMonth.removeClass(aktif);
                    months.removeClass(aktif);
                    ini.addClass(aktif);
                } 
            });
            // pilihan tahun ter-klik
            years.on(HELPER.click, function () { 
                var ini = $(this);
                if (!ini.hasClass(aktif))
                { 
                    optionYear.removeClass(aktif);
                    years.removeClass(aktif);
                    ini.addClass(aktif);
                } 
            });
            return this;
        };

        // mendapatkan index dari element input
        _controller.prototype.GetIndex = function(index)
        {
            return this.index = index;
        };

        // menampilkan option bulan dan tahun (button bulan dan tahun)
        _controller.prototype.showOption = function ()
        { 
            var btnMonth     = this.btnMonth,
                btnYear      = this.btnYear,
                option_year  = this.optionYear,
                option_month = this.optionMonth,
                inputMonth   = this.inputMonth,
                inputYear    = this.inputYear,
                months       = this.months, // nama-nama bulan pada option bulan
                years        = this.years; // tahun pada option tahun
            // klik pada button bulan
            btnMonth.on(HELPER.click, function () {
                var ini = $(this);
                for(var i = 0; i < months.length; i++)
                {
                    var _m = months.eq(i);
                    // jika data button bulan sama dengan option data bulan
                    (_m.attr('data-month') === ini.attr("data-month")) ? _m.addClass(aktif) : _m.removeClass(aktif);
                }
                option_year.removeClass(aktif); // hapus class aktif pada option tahun
                months.removeClass(none); // menghapus class none (jika pilihan bulan sedang di cari melalui input)
                inputMonth.val(""); // menghilangkan input bulan
                (option_month.hasClass(aktif)) ? option_month.removeClass(aktif) : option_month.addClass(aktif);
            });
            
            // klik pada button tahun
            btnYear.on(HELPER.click, function () {
                var ini = $(this);
                for(var i = 0; i < years.length; i++)
                {
                    var _y = years.eq(i);
                    // jika data button bulan sama dengan option data bulan
                    (_y.attr('data-year') === ini.attr("data-year")) ? _y.addClass(aktif) : _y.removeClass(aktif);
                }
                option_month.removeClass(aktif); // hapus class aktif pada option bulan
                inputYear.val(""); //menghilangkan input tahun
                years.removeClass(none);// menghapus class none (jika pilihan tahun sedang di cari melalui input)
                (option_year.hasClass(aktif)) ? option_year.removeClass(aktif) : option_year.addClass(aktif);
            });
            return this;
        };

        // input option bulan dan tahun saat di ketik
        _controller.prototype.inputOption = function ()
        { 
            var inputMonth = this.inputMonth,
                inputYear  = this.inputYear,
                months     = this.months,
                year       = this.years;
            
            // input bulan
            inputMonth.on(HELPER.input, function () { 
                var ini = $(this);
                __onInput(ini, months, 'name-month');
            });

            // input tahun
            inputYear.on(HELPER.input, function () { 
                var ini = $(this);
                __onInput(ini, year, 'data-year');
            });

            // saat ngetik input bulan atau tahun
            function __onInput(ini, data, attr)
            { 
                var str = ini.val().toLowerCase().replace(/^\s+|\s+$/gm, '');
                if (str.length !== 0)
                { 
                    for (var i = 0; i < data.length; i++)
                    {
                        var i_elem = data.eq(i),
                            i_data = i_elem.attr(attr).toString();
                        
                        (i_data.indexOf(str) !== -1) ? i_elem.removeClass(none) : i_elem.addClass(none);
                    }
                }
                else
                {
                    data.removeClass(none);
                }
            }
            return this;
        };

        // pilihan bulan [januari - desember] / tahun [19xx - 20xx] ter-klik
        _controller.prototype.optionClick = function ()
        {
            var btnOptionMonth  = this.months,
                btnOptionYear   = this.years,
                btnMonth        = this.btnMonth,
                btnYear         = this.btnYear,
                dateBody        = this.dateBody,
                btnLeft         = this.btnLeft,
                btnRight        = this.btnRight;
            // tombol option bulan
            btnOptionMonth.on(HELPER.click, function() {
                var ini             = $(this),
                    month           = ini.attr('data-month'),
                    year            = btnYear.attr('data-year'),
                    data            = (month + "-" + year).toString().split("-"),
                    changeDateLeft  = new Date(parseInt(year), parseInt(month) - 1), // mengubah data-date pada button left
                    changeDateRight = new Date(parseInt(year), parseInt(month) + 1); // mengubah data-date pada button right;
                
                    btnMonth.attr('data-month', month);
                    btnMonth.text(tanggal.setNameMonth(month));

                    dateBody.html(tanggal.changeValue(data)._sectionBody(""));

                    btnLeft.attr('data-date',  changeDateLeft.getMonth()  + "-" + changeDateLeft.getFullYear());
                    btnRight.attr('data-date', changeDateRight.getMonth() + "-" + changeDateRight.getFullYear());
            });

            btnOptionYear.on(HELPER.click, function() {
                var ini             = $(this),
                    month           = btnMonth.attr('data-month'),
                    year            = ini.attr('data-year'),
                    data            = (month + "-" + year).toString().split("-"),
                    changeDateLeft  = new Date(parseInt(year), parseInt(month) - 1), // mengubah data-date pada button left
                    changeDateRight = new Date(parseInt(year), parseInt(month) + 1); // mengubah data-date pada button right;
                
                    btnYear.attr('data-year', year);
                    btnYear.text(year);

                    dateBody.html(tanggal.changeValue(data)._sectionBody(""));

                    btnLeft.attr('data-date',  changeDateLeft.getMonth()  + "-" + changeDateLeft.getFullYear());
                    btnRight.attr('data-date', changeDateRight.getMonth() + "-" + changeDateRight.getFullYear());
            });

            return this;
        };

        // mengganti data apabila button left / right ter-klik
        _controller.prototype.__clickOptionButton = function (btn, data, type)
        {
            var btnMonth = btn[0],
                btnYear  = btn[1],
                date_day = body.find(HELPER.cls[14]); // mendapatkan date-container pada full-day
            
            // mendapatkan perubahan data setial kali button left ter-klik
            // element untuk mendapatkan data-date pada button left / right
            var data_change = tanggal._changeFullDay(data);
            // jika type bernilai undefined maka bernilai left
            if(typeof type === 'undefined')
            {
                setTimeout(function() { 
                    date_day.eq(0).removeClass("left"); // menghapus element full-day setelah ter-append
                    date_day.eq(1).addClass("right"); // menambahkan class right ke element full-day yang kedua (setelah append pertama dari date_day.eq(0)) 
                }, 200);
                setTimeout(function() { 
                    date_day.eq(1).remove();
                }, 500);
            }
            else
            {
                setTimeout(function() { 
                    date_day.eq(0).addClass("left"); // menghapus element full-day setelah ter-append
                    date_day.eq(1).removeClass("right"); // menambahkan class right ke element full-day yang kedua (setelah append pertama dari date_day.eq(0)) 
                }, 200);
                setTimeout(function() { 
                    date_day.eq(0).remove();
                }, 500);
            }
            
            btnMonth.attr('data-month', data_change.month);
            btnMonth.text(data_change.nameMonth);
            btnYear.attr('data-year', data_change.year);
            btnYear.text(data_change.year);

            return this;
        }

        //button ganti bulan/tahun bagian kiri dan kanan
        _controller.prototype.changeButtonHeader = function()
        {
            var btnLeft     = this.btnLeft,
                btnRight    = this.btnRight,
                dateBody    = this.dateBody,
                dateOption  = [this.btnMonth, this.btnYear],
                clickOption = this.__clickOptionButton,
                day         = this.day;
            //button kiri
            btnLeft.on(HELPER.click, function() {
                var ini    = $(this),
                    data   = ini.attr('data-date').split("-"), // mendapatkan data-date pada button left
                    data2  = btnRight.attr('data-date').split("-"), // mendapatkan data-date pada button right
                    month  = data[0], // bulan pada button left
                    year   = data[1], // tahun pada button left
                    month2 = data2[0], // bulan pada button right
                    year2  = data2[1], // tahun pada button right
                    changeDateLeft  = new Date(parseInt(year), parseInt(month) - 1), // mengubah data-date pada button left
                    changeDateRight = new Date(parseInt(year2), parseInt(month2) - 1); // mengubah data-date pada button right
                // jika button left tidak terklik atau tidak mempunyai class wait
                if(!ini.hasClass("wait"))
                {
                    var data_date = ini.attr('data-date');
                    ini.addClass("wait"); // menambahkan class wait untuk menunggu jeda penggantian tanggal

                    //append element full-day ke urutan pertama
                    dateBody.prepend(tanggal.changeValue(data)._sectionBody("left"));

                    ini.attr('data-date', changeDateLeft.getMonth() + "-" + changeDateLeft.getFullYear());
                    btnRight.attr('data-date', changeDateRight.getMonth() + "-" + changeDateRight.getFullYear());
                    
                    clickOption(dateOption, data_date);

                    var body_date = body.find(HELPER.cls[14]); // mendapatkan date-container pada full-day;
                    // memastikan bahwa element date-container tidak melebihi dari satu setelah di append tanggal bulan&tahun baru
                    if(body_date.length === 0) ini.removeClass("wait");

                    setTimeout(function() { 
                        ini.removeClass("wait");
                    }, 500);
                }
            });

            btnRight.on(HELPER.click, function() {
                var ini             = $(this),
                    data            = btnLeft.attr('data-date').split("-"), // mendapatkan data-date pada button left
                    data2           = ini.attr('data-date').split("-"), // mendapatkan data-date pada button right
                    month           = data[0], // bulan pada button left
                    year            = data[1], // tahun pada button left
                    month2          = data2[0], // bulan pada button right
                    year2           = data2[1], // tahun pada button right
                    changeDateLeft  = new Date(parseInt(year), parseInt(month) + 1), // mengubah data-date pada button left
                    changeDateRight = new Date(parseInt(year2), parseInt(month2) + 1); // mengubah data-date pada button right
                // jika button left tidak terklik atau tidak mempunyai class wait
                if(!ini.hasClass("wait"))
                {
                    var data_date = ini.attr('data-date');

                    ini.addClass("wait"); // menambahkan class wait untuk menunggu jeda penggantian tanggal

                    //append element full-day ke urutan kedua
                    dateBody.append(tanggal.changeValue(data2)._sectionBody("right"));

                    ini.attr('data-date', changeDateRight.getMonth() + "-" + changeDateRight.getFullYear());
                    btnLeft.attr('data-date', changeDateLeft.getMonth() + "-" + changeDateLeft.getFullYear());

                    clickOption(dateOption, data_date, true);

                    var body_date = body.find(HELPER.cls[14]); // mendapatkan date-container pada full-day;
                    // memastikan bahwa element date-container tidak melebihi dari satu setelah di append tanggal bulan&tahun baru
                    if(body_date.length === 0) ini.removeClass("wait");

                    setTimeout(function() { 
                        ini.removeClass("wait");
                    }, 1000);
                }
            });
            return this;
        }

        // mengganti waktu hour, minutes, seconds & miliseconds
        _controller.prototype.changeTime = function() 
        {
            var btnTimeUp   = this.btnTimeUp,
                btnTimeDown = this.btnTimeDown,
                time        = "._time-inner";

            btnTimeUp.on(HELPER.click, function() {
                var ini   = $(this),
                    type  = ini.siblings(time).attr('data-time'),
                    elem  = ini.siblings(time).find("._time");
                for(var i = 0; i < elem.length; i++)
                {
                    var i_time = elem.eq(i);
                    if(i_time.hasClass(aktif) && i !== 0)
                    {
                        var up      = i - 1,
                            elem_up = elem.eq(up),
                            data    = elem_up.text();
                        elem_up.addClass(aktif);
                        elem_up.removeClass("__top");
                        i_time.removeClass("__top __down aktif");
                        i_time.addClass("__down");

                        tanggal.changeTime(type, data);
                    }
                }
            });

            btnTimeDown.on(HELPER.click, function() {
                var ini    = $(this),
                    type   = ini.siblings(time).attr('data-time'),
                    elem   = ini.siblings(time).find("._time"),
                    length = elem.length - 1;

                for(var i  = length; i >= 0; i--)
                {
                    var i_time = elem.eq(i);

                    if(i_time.hasClass(aktif) && i !== length)
                    {
                        var down      = i + 1,
                            elem_down = elem.eq(down),
                            data      = elem_down.text();
                        elem_down.addClass(aktif);
                        elem_down.removeClass("__down");
                        i_time.removeClass("__top __down aktif");
                        i_time.addClass("__top");

                        tanggal.changeTime(type, data);
                    }
                }
            });
            return this;
        };

        _controller.prototype.SetDate = function (elem)
        {
            var date    = this.elem;

            // off() digunakan untuk menghilangkan event handler pada on (seperti click, dsb)
            // dengan kata lain untuk menghilangkan duplicate event handler
            date.off().on(HELPER.click, HELPER.cls[15] + "," + HELPER.cls[18] , function(x) {
                var ini         = $(this), // mendapatkan object hasil dari perubahan tanggal
                    nodeName    = typeof elem.context !== 'undefined' ? elem.context.nodeName.toLowerCase() : elem.get(0).nodeName.toLowerCase(),
                    attr        = tanggal.setAttr(), // mendapatkan attribute dari parameters object _init
                    typeElement = nodeName, // mendapatkan type dari element yang ter-klik
                    day         = ini.attr('data-day');
                // jika hari yang di pilih bukan hari yang kosong
                if(typeof day !== 'undefined')
                {
                    
                    if(tanggal.isMultiSetDate())
                    {
                        if(window.event.ctrlKey && x.which === 1)
                        {
                            if(typeElement === 'input' || typeElement === 'textarea')
                            {
                                elem.val(tanggal.setDatePicker(day, true)).trigger('change');
                            }
                            else
                            {
                                elem.text(tanggal.setDatePicker(day, true));
                                elem.attr(attr, tanggal.setDatePicker(day, true));
                            }
                            (ini.hasClass('select')) ? ini.removeClass('select') : ini.addClass('select');
                        }
                        else
                        {
                            if(typeElement === 'input' || typeElement === 'textarea')
                            {
                                elem.val(tanggal.setDatePicker(day)).trigger('change');
                            }
                            else
                            {
                                elem.text(tanggal.setDatePicker(day));
                                elem.attr(attr, tanggal.setDatePicker(day));
                            }
                            date.removeClass(aktif);
                        }
                    }
                    else
                    {
                        if(typeElement === 'input' || typeElement === 'textarea')
                        {
                            elem.val(tanggal.setDatePicker(day)).trigger('change');
                        }
                        else
                        {
                            elem.text(tanggal.setDatePicker(day));
                            elem.attr(attr, tanggal.setDatePicker(day));
                        }
                        // menghilangkan tampilan rajunane-date
                        date.removeClass("aktif");
                    }
                }
                // button time
                else
                {
                    var select_day = body.find(HELPER.cls[15] + ".select"),
                        result_day = select_day.length !== 0 ? select_day : body.find(HELPER.cls[15] + '.today');
                        day = result_day.attr('data-day');
                    console.log(typeof select_day);
                    if(typeElement === 'input' || typeElement === 'textarea')
                    {
                        elem.val(tanggal.setDatePicker(day)).trigger('change');
                    }
                    date.removeClass(aktif);
                }
            });
            return this;
        };

        var controller = new _controller();

        body._init = function (object, base) {
            // getValue = mendapatkan parameters attribute (jika ada) untuk mendapatkan value / isi
            // pos      = mendapatkan posisi element
            // getAttr  = mendapatkan attribute value, berdasarkan parameters objectnya (JIKA bukan element input / textarea)
            var getAttr       = (object.attr) ? base.val() : DEFAULT.attr,
                getValue      = "",
                getDaysName   = (object.daysName && tanggal._validDaysNames(object.daysName)) ? object.daysName : DEFAULT.daysName,
                formatDate    = (object.formatDate && tanggal._validFormatDate(object.formatDate)) ? object.formatDate : DEFAULT.formatDate,
                getHoliday    = (object.holiday && tanggal._validHoliday(object.holiday)) ? object.holiday : DEFAULT.holiday,
                getRangeYears = (object.rangeYears && tanggal._validRangeYears(object.rangeYears)) ? object.rangeYears : DEFAULT.rangeYears,
                getMonthsName = (object.monthsName && tanggal._validMonthsNames(object.monthsName)) ? object.monthsName : DEFAULT.monthsName,
                formatTime    = (object.formatTime && tanggal._validFormatTime(object.formatTime)) ? object.formatTime : DEFAULT.formatTime,
                showDate      = (object.showDate && tanggal._validShowDate(object.showDate)) ? object.showDate : null,
                getMinutes    = (object.minutes && tanggal._validTime(object.minutes)) ? object.minutes : DEFAULT.minutes,
                getHours      = (object.hours && tanggal._validTime(object.hours)) ? object.hours : DEFAULT.hours,
                getPermanent  = (object.permanentHolidays && tanggal._validPermanentHolidays(object.permanentHolidays)) ? object.permanentHolidays : DEFAULT.permanentHolidays;
                getMultiSetDate= (object.multiSetDate && tanggal._validMultiSetDate(object.multiSetDate)) ? object.multiSetDate : DEFAULT.multiSetDate;
                offset        = base.offset(),
                height        = base.outerHeight(),
                width         = base.outerWidth(),
                pos           = {
                    top       : offset.top, // posisi atas element selected
                    left      : offset.left, // posisi kiri element selected
                    height    : 400,  // tinggi element selected
                    width     : 350,   // panjang element selected
                    pageX     : window.pageXOffset,  // tinggi window
                    pageY     : window.pageYOffset, // 
                    elemHeight: height,
                    elemWidth : width,
                };
            var nodeName = typeof base.context !== 'undefined' ? base.context.nodeName.toLowerCase() : base.get(0).nodeName.toLowerCase();
            if((object.attr || !object.attr) && (nodeName === 'textarea' || nodeName === 'input'))
            {
                getValue = base.val();
            }
            else
            {
                getValue = (object.attr) ? base.attr(object.attr) : DEFAULT.attr;
            }
            // apply value element
            /*
                Beberapa hal:
                1. Pengecekan data apakah value pada attribute sesuai dengan peraturan formatDate
                2. Pengecekan data attribute (default attribute = "value") jika tidak kosong dan menghapus white space (trim)
                3. Mendapatkan posisi element
                4. Mendapatkan array hari libur
                5. Mendapatkan Nama hari dan singkatan nya
                6. Mendapatkan Nama bulan
                7. Mendapatkan jarak antar tahun
                8. Set value setiap split, berdasarkan formatDate 
            */
            tanggal.init(formatDate, formatTime)
                   .GetMultiSetDate(getMultiSetDate)
                   .GetShowDate(showDate)
                   .GetValue(getValue)
                   .GetHours(getHours)
                   .GetMinutes(getMinutes)
                   .GetAttribute(getAttr)
                   .position(pos)
                   .GetPermanentHolidays(getPermanent)
                   .GetHoliday(getHoliday)
                   .GetDaysName(getDaysName)
                   .GetMonthsName(getMonthsName)
                   .GetRangeYears(getRangeYears)
                   .setValue();
            
            // jika html/body tidak terdapat element arjunane-date maka akan append
            (body.find(HELPER.cls[1]).length === 0) ? body.append(tanggal.append(false)) : body.find(HELPER.cls[1]).html(tanggal.append(true));

            // mendapatkan element arjunane-date setelah append
            var date = body.find(HELPER.cls[1]);

            controller.getElement(date)
                      .findAll()
                      .showOption()
                      .inputOption()
                      .selectOption()
                      .changeButtonHeader()
                      .optionClick()
                      .changeTime()
                      .SetDate(base);
            
            tanggal.el(date).setPosition();

            // menambahkan class aktif pada element arjunane-date setelah .2 detik
            setTimeout(function () {
                date.addClass(aktif);
            }, 200);     

            $('html').on(HELPER.click, function (x) { 
                if (!$(x.target).is(HELPER.cls[2]) && !$(x.target).is(base)) date.removeClass(aktif);
            });
        };
        if (typeof e === 'string') //jika parameter pertama berupa string (milih element)
        {
            return $(this).on(HELPER.click, e, function() {
                $(this).each(function() {
                    var base   = $(this),
                        index  = $(this).index();
                    body._init(handler, base);
                });
            });
        }
        else if(typeof e === 'object')
        {
            return $(this).on(HELPER.click, function() {
                $(this).each(function() {
                    var base   = $(this),
                        index  = $(this).index();
                    body._init(e, base);
                });
            });
        }
    };

    var tgl = function ()
    {

        this.elem           = null; // untuk mendapatkan element
        this.value          = null; // untuk mendapatkan value sesuai dengan attribute yang dimasukkan

        this.daysName       = new Array(); // nama hari dan singkatan nya
        this.monthsName     = new Array(); // nama hari dan singkatan nya
        
        this.attr           = null; // mendapatkan attribute pada element select

        this.changeMonth    = null; // mendeteksi perubahan pada bulan (apabila button bulan ter-klik)
        this.changeYear     = null; // mendeteksi perubahan pada tahun (apabila button tahun ter-klik)

        this.firstDay       = null; // untuk mendapatkan hari pertama
        this.lastDay        = null; // untuk mendapatkan hari terakhir

        this.isDate         = true; // untuk set apakah tanggal akan di tampilkan atau tidak (bukan pada body waktu)
        this.isTime         = false; // untuk set apakah tanggal akan di tampilkan atau tidak (bukan pada body waktu)

        this.day            = null; // set hari sesuai perubahan
        this.month          = null; // set bulan sesuai perubahan
        this.year           = null; // set tahun sesuai perubahan

        this.hour           = null;
        this.minutes        = null;
        this.seconds        = null;
        this.miliseconds    = null;
        this.dataMinutes    = null;
        this.dataHours      = null;

        this.multiSetDate   = false;
        this.multiDate      = null;

        this.formatTime     = null; // format waktu

        this.valDay         = null; // set hari sesuai perubahan
        this.valMonth       = null; // set bulan sesuai perubahan
        this.valYear        = null; // set tahun sesuai perubahan
        this._day           = dt.getDate(); // set hari ini jika input kosong
        this._month         = dt.getMonth() + 1; // set bulan ini jika input kosong
        this._year          = dt.getFullYear(); // set tahun ini jika input kosong
        this._splitDefault  = "-"; // default split
        this._split         = "-"; // split default, tapi akan di ganti jika parameters formatDate (object) sesuai dengan salah satu HELPER.formatDate
        this.today          = null; // set tanggal hari ini dengan default mm-dd-yyyy

        this.rangeYears_1   = null; // jarak tahun pertama
        this.rangeYears_2   = null; // jarak tahun terakhir
        this.isRangeYear    = true; // validasi jarak antar tahun

        this.left           = null; // set posisi left sesuai posisi element select
        this.top            = null; // set posisi top sesuai posisi element select
        this.permanentHolidays= null;

        this._indexDay      = null; // mendapatkan index hari dari split di dalam formatDate
        this._indexMonth    = null; // mendapatkan index hari dari split di dalam formatDate
        this._indexYear     = null; // mendapatkan index hari dari split di dalam formatDate
    
        this.isNormalizeValue = false; // jika value ter-normalisasi (jika input kosong)
        this.normalizeHoliday = null; // menormalkan data holiday jika dalam satu array memiliki beberapa hari ("06-15-2018_06-30-2018")
        this.isChangeHoliday  = false; // deteksi perubahan pada hari libur jika input element ter-klik

        this._pos           = null;
    };

    var tanggal = new tgl();

    tgl.prototype.append = function (change)
    {
        var date   = "",
        dt = "",
            isDate = this.isDate,
            isTime = this.isTime;
        // jika element arjunane-date ada maka "html"
        if(isDate)
        {
            dt += this._header() + 
                    this._optionMonth() + 
                    this._optionYear() + 
                    this._sectionHeader() + 
                    this._sectionBody();
        }
        if(isTime && !this.isMultiSetDate()) 
        {
            dt += this._sectionTime();
        }

        if (change)
        {    
            date = dt;
        }
        else
        {
            date += '<div class="' + HELPER.cls[0] + '">' +
                        dt +
                    '</div>';  
        }   
        return date;
    };

    // mendapatkan element arjunane-date
    tgl.prototype.el = function (el)
    {
        this.elem = el;
        return this;
    };

    // mengganti waktu (button atas/bawah ganti waktu)
    tgl.prototype.changeTime = function (type, data)
    {
        if     (type === 'hour') {this.hour        = data;}
        else if(type === 'min')  {this.minutes     = data;}
        else if(type === 'sec')  {this.seconds     = data;}
        else                     {this.miliseconds = data;}
        return this;
    };

    // ganti value
    tgl.prototype.changeValue = function (value)
    { 

        this.changeMonth = value[0];
        this.changeYear  = value[1];
        
        return this;
    }

    //validasi format tanggal
    tgl.prototype.init = function (_formatDate, _formatTime)
    {
        // jika parameters _formatDate sesuai dengan salah satu dari HELPER->formatDate (untuk sekedar validasi)
        // reset changeMonth & changeYear & isChangeHoliday & normalizeHoliday setiap kali input element ter-klik
        this.changeMonth      = null;
        this.changeYear       = null;
        this.isChangeHoliday  = false;
        this.normalizeHoliday = null; // menghilangkan array holiday
        this.permanentHolidays= null; // menghilangkan array pada liburan permanent
        this.isNormalizeValue = false; // menghilangkan array normalisa value pada element input
        this.isDate           = true;
        this.isTime           = false;
        this.multiDate        = new Array();

        // _split     = memisahkan tanda formatDate sesuai dengan parameters Object nya
        var _split;
        if      (_formatDate.split("-").length > 1) { _split = _formatDate.split("-"); this._split = "-"; }
        else if (_formatDate.split("/").length > 1) { _split = _formatDate.split("/"); this._split = "/"; }
        else if (_formatDate.split(".").length > 1) { _split = _formatDate.split("."); this._split = "."; }
        var dd            = _split.indexOf("dd"), // mendapatkan index hari dari hasil split
            mm            = _split.indexOf("mm"), // mendapatkan index bulan dari hasil split
            yyyy          = _split.indexOf("yyyy"); // mendapatkan index tahun dari hasil split
        this._indexDay    = dd;
        this._indexMonth  = mm;
        this._indexYear   = yyyy;

        this.formatTime   = _formatTime;

        return this;
    };


    //mendapatkan value pada inputan berdasarkan attribute nya
    tgl.prototype.GetValue = function (value)
    {
        //trim
        var val     = value.toString().replace(/^\s+|\s+$/gm, ''),
            valTime = val.split(" ");
        // jika panjang input sama dengan 0 dan value tanggal tidak sesuai && formatDate yang di input tidak sesuai (bernilai false)
        if (val.length === 0 && !this._validDate(val))
        { 
            // mengurutkan value sesuai dengan formatDate
            var today    = [ [this._indexDay, this._day], [this._indexMonth, this._month], [this._indexYear, this._year] ];
            this.today = this._normalizeNullValue(today);
            this.value = this.today;
        }
        else
        { 
            var splitMultiVal   = value.split(",");
            // check apakah multi set date bernilau true
            if(this.isMultiSetDate() && splitMultiVal.length > 1)
            {
                for(var i = 0; i < splitMultiVal.length; i++)
                {
                    this.multiDate.push(splitMultiVal[i]);
                }
            }
            else
            {
                this.value = (valTime.length === 1) ? val : valTime[0];
                this.multiDate.push(this.value);
            }
        }
        // jika ada waktu
        if(valTime.length === 2)
        {
            var time         = valTime[1].split(":");   
            // jam
            this.hour        = (typeof time[0] !== 'undefined' && time[0].length !== 0 ) ? time[0] : "00";
            // menit
            this.minutes     = (typeof time[1] !== 'undefined' && time[1].length !== 0 ) ? time[1] : "00";
            // detik
            this.seconds     = (typeof time[2] !== 'undefined' && time[2].length !== 0 ) ? time[2] : "00";
            //mili detik
            this.miliseconds = (typeof time[3] !== 'undefined' && time[3].length !== 0 ) ? time[3] : "00";
        }
        else
        {
            this.hour        = "00";
            this.minutes     = "00";
            this.seconds     = "00";
            this.miliseconds = "00";
        }
        return this;
    };

    // get multiple set date
    tgl.prototype.GetMultiSetDate = function(params)
    {
        this.multiSetDate = params;
        return this;
    };

    tgl.prototype.GetHours    = function (hours)
    {
        this.dataHours   = hours;
        return this;
    };

    tgl.prototype.GetMinutes  = function (minutes)
    {
        this.dataMinutes = minutes;
        return this;
    }

    // mendapatkan boolean untuk menampilkan tanggal atau waktu
    tgl.prototype.GetShowDate  = function (show)
    {
        if(show !== null)
        {
            if(show.length === 1)
            {
                this.isDate = show[0];
                this.isTime = false;
            }
            else
            {
                this.isDate = show[0];
                this.isTime = show[1];
            }
        }
        else
        {
            this.isDate = true;
            this.isTime = false;
        }
        return this;
    };

    tgl.prototype.GetAttribute = function (attr)
    {
        this.attr = attr;
        return this;
    };

    // mendapatkan nama hari dan singkatan nya
    tgl.prototype.GetDaysName = function (days)
    { 
        this.daysName = days;
        return this;
    };

    // mendapatkan hari libur yang permanent (tidak berubah-ubah)
    tgl.prototype.GetPermanentHolidays = function(permanent)
    {
        this.permanentHolidays = permanent;
        return this;
    };
    // mendapatkan hari libur
    tgl.prototype.GetHoliday = function (holiday)
    { 
        this.holiday = holiday;
        return this;
    };

    tgl.prototype.GetRangeYears = function (_years)
    {
        // menghapus spasi
        var years = _years.toString().replace(/\s/g, ''),
            split = years.split(":"),
            oneYear = years.split("_");
        // jika ada jarak antar tahun
        if(this.isRangeYear)
        {
            if(split.length === 1)
            {
                this.rangeYears_1 = split[0];
            }
            else
            {
                this.rangeYears_1 = split[0];
                this.rangeYears_2 = split[1];
            }
        }
        else
        {
            this.rangeYears_1 = oneYear[1];
        }
        return this;
    }

    // mendapatkan nama bulan
    tgl.prototype.GetMonthsName = function (months)
    { 
        this.monthsName = months;
        return this;
    };

    //arjunane-date bagian header (left center[tahun, bulan] right)
    tgl.prototype._header = function ()
    {
        var month = this.monthsName[parseInt(this.month)],
            year  = this.year,
            firstDate = new Date(this.year, this.month - 1), // bulan lalu
            lastDate  = new Date(this.year, this.month + 1); //bulan depan
        var header = '<div data-date="" class="_date-header __name">' +
                        '<div data-date="' + firstDate.getMonth() + "-" + firstDate.getFullYear() + '" class="_date-header-left"></div>' +
                        '<div data-month="' + this.month + '" class="_date-header-center month">'+ month +'</div>' +
                        '<div data-year="' + this.year + '" class="_date-header-center year">'+ year  +'</div>' +
                        '<div data-date="' + lastDate.getMonth() + "-" + lastDate.getFullYear() + '" class="_date-header-right"></div>' +
                     '</div>';
        return header;
    };

    // check apakah multiSetDate true
    tgl.prototype.isMultiSetDate = function()
    {
        return this.multiSetDate;
    };

    //arjunane-date bagian section header [Sen-Min || Senin - Minggu]
    tgl.prototype._sectionHeader = function ()
    {
        var days = "";
        for (var i = 0; i < this.daysName.length; i++)
        {
            var name   = this.daysName[i],
                minggu = (i === 0) ? " minggu" : "";
            days += '<div class="days' + minggu +  '" title="' + name[0] + '">' + name[1] + '</div>';
        }
        // jika tidak ada perubahan pada value (value berganti)
        var sectionHeader = '<div data-date="" class="_date-body">' + days + '</div>';
        return sectionHeader;
    };
    //arjunane-date bagian section body [1-31]
    tgl.prototype._sectionBody = function (change)
    {
        var month           = (this.changeMonth === null) ? this.month : this.changeMonth,
            year            = (this.changeYear  === null) ? this.year  : this.changeYear,
            _firstDay       = new Date(year, month, 1),
            _lastDay        = new Date(year, parseInt(month) + 1, 0),
            lastDay         = _lastDay.getDate(), // mendapatkan tanggal akhir
            firstDay        = _firstDay.getDay(); // mendapatkan hari pertama setelah minggu; 
        //console.log(new Date(2018, 0 -1).getUTCFullYear());
        var sectionHeader = "",
            dateCenter    = "";
        // jika tidak ada perubahan pada value changeMonth/changeYear atau baru ter-append
        if(typeof change === 'undefined')
        {
            dateCenter    = this.__setBodyDate(firstDay, lastDay);
            sectionHeader = '<div class="_date-body full-day">' + dateCenter + '</div>';
        }
        else
        {
            // change merupakan class full-day untuk tampil dari kiri atau kanan
            dateCenter    = this.__setBodyDate(firstDay, lastDay, change);
            sectionHeader = dateCenter;
        }
        return sectionHeader;
    };

    tgl.prototype._sectionTime      = function ()
    {
        var time       = '<div class="_date-time">',
            formatTime = this.formatTime.split(":"),
            valHour    = this.hour,
            valMin     = this.minutes,
            valSec     = this.seconds,
            valMS      = this.miliseconds;
            
            for(var i = 0; i < formatTime.length; i++)
            {
                // jam
                if(i === 0)
                {
                    time += '<div class="_time-container hour">';
                    time +=     '<div class="_time-text hour">Hour :</div>'; // keterangan Hour :
                    time +=     '<div class="_time-up"></div>'; // button panah atas
                    time +=     '<div class="_time-down"></div>'; // button panah bawah
                    time +=         '<div class="_time-inner" data-time="hour">';

                    // mendapatkan hasil array jam
                    var hours = this._setTimes();
                    
                    for(var h = 0; h < hours.length; h++)
                    {
                        var _hour    = "",
                            jamAktif = "",
                            cls      = "";
                        
                        // menerapkan angka jam yang manusiawi
                        if      (parseInt(hours[h]) < 10 ) { _hour = "0" + parseInt(hours[h]); } // jika jam kurang dari 10
                        else                               { _hour = hours[h];                 }

                        // jika value jam ada di hasil array jam dan jam aktif (sesuai input) sama dengan jam loop [hours]
                        if(hours.indexOf(parseInt(valHour)) !== -1 && parseInt(valHour) === parseInt(hours[h])) 
                        {
                            cls       = " aktif"; 
                            this.hour = _hour; 
                        }
                        else if(h === 0 && hours.indexOf(parseInt(valHour)) === -1)                                                              
                        {
                            cls       = " aktif"; 
                            this.hour = _hour; 
                        }

                        jamAktif  = parseInt(hours[h]);

                        // jika jam aktif (sesuai input) kurang dari jam aktif  dan value jam tidak sama dengan jam loop [hours]
                        if     ((parseInt(valHour) < jamAktif && parseInt(valHour) !== jamAktif)) { cls += " __down"; }
                        else if((parseInt(valHour) > jamAktif && parseInt(valHour) !== jamAktif)) { cls += " __top";  }

                        time += '<div data-num="' + _hour + '" class="_time' + cls + '">' + _hour + '</div>';
                    }
                    time +=         '</div>';
                    time += '</div>';
                }
                // selain jam (menit, detik, milidetik)
                else
                {
                    var text      = "", // keterangan Min, Sec, MS :
                        name      = "", // nama class atau nama attribute : min, sec, ms
                        _time     = "", // mendapatkan waktu pada minutes/seconds/miliseconds
                        timeAktif = "";
                        
                    if     (i === 1) { text = "Min"; name = "min"; _time = valMin;}
                    else if(i === 2) { text = "Sec"; name = "sec"; _time = valSec;}
                    else             { text = "MS";  name = "ms";  _time = valMS; }

                    time += '<div class="_time-container ' + name + '">';
                    time +=     '<div class="_time-text ' + name + '">' + text + ' :</div>'; // keterangan Min, Sec, MS :
                    time +=     '<div class="_time-up"></div>'; // button panah atas
                    time +=     '<div class="_time-down"></div>'; // button panah bawah
                    time +=         '<div class="_time-inner" data-time="' + name + '">';

                    // jika menit
                    if(i === 1)
                    {
                        var minutes = this._setTimes("minutes");
                        for(var h = 0; h < minutes.length; h++)
                        {
                            var min = "",
                                cls = "";

                            // menerapkan angka jam yang manusiawi
                            if      (parseInt(minutes[h]) < 10)  { min = "0" + parseInt(minutes[h]); } // jika jam kurang dari 10
                            else                                 { min = minutes[h];                 }
                            
                            if(minutes.indexOf(parseInt(_time)) !== -1 && parseInt(_time) === parseInt(minutes[h])) 
                            {
                                cls          = " aktif"; 
                                this.minutes = min;
                            }
                            else if(h === 0 && minutes.indexOf(parseInt(_time)) === -1)
                            {
                                cls       = " aktif"; 
                                this.minutes = min;
                            }   

                            timeAktif = parseInt(minutes[h]);

                            if     ((parseInt(_time) < timeAktif && parseInt(_time) !== timeAktif)) { cls += " __down"; }
                            else if((parseInt(_time) > timeAktif && parseInt(_time) !== timeAktif)) { cls += " __top";  }

                            time += '<div data-num="' + min + '" class="_time' + cls + '">' + min + '</div>';
                        }
                    }
                    else
                    {
                        for(var h = 0; h < 60; h++)
                        {
                            var num = "",
                                cls = "";

                            // menerapkan angka jam yang manusiawi
                            if      (h < 10)  { num = "0" + h; } // jika jam kurang dari 10
                            else              { num = h;       }
                            
                            if(parseInt(_time) === h) 
                            {
                                cls          = " aktif"; 
                                (i === 2) ? this.seconds = h : this.miliseconds = h;
                            }
                            else if(h === 0 && parseInt(_time).length === 0)                                                              
                            {
                                cls       = " aktif"; 
                                (i === 2) ? this.seconds = h : this.miliseconds = h;
                            }   
                            
                            if     ((parseInt(_time) < h && parseInt(_time) !== h)) { cls += " __down"; }
                            else if((parseInt(_time) > h && parseInt(_time) !== h)) { cls += " __top";  }
                            time += '<div data-num="' + h + '" class="_time' + cls + '">' + num + '</div>';
                        }
                    }

                    time +=         '</div>';
                    time += '</div>';
                }
            }
        time += '<div class="__button-time">OK</div>'
        time += '</div>';
        return time;
    };

    // menormalkan value pada multiDate
    tgl.prototype._normalizeMultiDate = function(date)
    {
        var split  = date.split(this._split),
            space  = this._splitDefault,
            day    = split[this._indexDay],
            month = parseInt(split[this._indexMonth]) - 1,
            year   = split[this._indexYear];
        return month +  space + day + space + year;
    }

    // menormalkan holiday
    tgl.prototype._normalizeHoliday = function ()
    {
        var hol     = this.holiday,
            holiday = new Array();
            // jika element input ter-klik, otomatis holiday akan ter-set
            // dan untuk menghindari duplicate holiday, maka isCHangeHoliday bersifat false untuk mendeteksi perubahan terjadi ketika klik input element
            if(!this.isChangeHoliday)
            {
                for(var i = 0; i < hol.length; i++)
                {
                    var _h = this.holiday[i],
                        split = _h[0].split("_"); // mendapatkan tanggal
                    // jika ada hari libur yang lebih dari beberapa hari (misal selama 4 hari)
                    if(split.length > 1)
                    {
                        var start   = new Date(split[0]), // hasil split pertama
                            end     = new Date(split[1]), // hasil split kedua
                            loop    = new Date(start),
                            no      = 0;
                        while(loop < end)
                        {
                            var plus = 0,
                                tgl  = "",
                                s    = this._splitDefault;
                            plus = (no === 0) ? 0 : 1;
                            var newDate = loop.setDate(loop.getDate() + plus); // menambahkan 1 hari setiap while
                            loop = new Date(newDate);
                             
                            tgl = loop.getMonth() + s + loop.getDate() + s + loop.getFullYear();
                            holiday.push([tgl, _h[1]]);
                            no++;
                        }
                    }
                    else
                    {
                        holiday.push([_h[0], _h[1]]);
                    }
                }
            }
        this.normalizeHoliday = holiday;
        return this.normalizeHoliday;
    }

    // menormalisasikan jika value element null atau kosong
    tgl.prototype._normalizeNullValue = function (arr)
    {
        var val = "";
        arr.sort(function (a,b) {
            return a[0] - b[0];
        });
        for(var i = 0; i < arr.length; i++)
        {
            // mendapatkan tanda split
            var split = (i !== (arr.length - 1)) ? this._split : ""; 
            val += arr[i][1] + split;
        }
        this.isNormalizeValue = true;
        return val;
    };

    // menormalisasikan value sesuai dengan perubahan tanggal dan hari yang ter-klik
    // pada tahap ini, tanggal akan di sesuaikan dengan formatDate yang telah di masukkan di parameters object nya
    tgl.prototype._normalizeSetDatePicker = function(day, month, year)
    {
        var val      = "",
            arr_date = [ 
                [this._indexDay, day], 
                [this._indexMonth, month], 
                [this._indexYear, year] 
            ],
            arr_time = [
                [0, this.hour],
                [1, this.minutes],
                [2, this.seconds],
                [3, this.miliseconds]
            ],
            formatTimeLength = this.formatTime.split(":"),
            date = "",
            time = "",
            space = (this.isDate && this.isTime && !this.isMultiSetDate()) ? " " : "";
        arr_date.sort(function (a,b) {
            return a[0] - b[0];
        });

        arr_time.sort(function (a,b) {
            return a[0] - b[0];
        });

        if(this.isDate){
            for(var i = 0; i < arr_date.length; i++)
            {
                // mendapatkan tanda split
                var split = (i !== (arr_date.length - 1)) ? this._split : ""; 
                date += arr_date[i][1] + split;
            }
        }

        if(this.isTime && !this.isMultiSetDate())
        {
            for(var i = 0; i < formatTimeLength.length; i++)
            {
                // mendapatkan tanda split
                var split = (i !== (formatTimeLength.length - 1)) ? ":" : ""; 
                var _time = arr_time[i][1] < 10 ? "0" + parseInt(arr_time[i][1]) : arr_time[i][1];
                time += _time + split;
            }
        }
        
        val = date + space + time;
        return val;
    };

    // menerapkan setiap value pada variable _day, _month, _year sesuai dengan split
    tgl.prototype.setValue = function ()
    { 
        // check apakah value input merupakan array dari multiSetDate
        var multiDate = this.multiDate;
        if(multiDate.length > 1)
        {
            //memisahkan value tanggal multiSetDate berdasarkan tanggal pertama
            var val = this.multiDate[0].split(this._split);
            this.day   = val[this._indexDay]; // mendapatkan hari sesuai dengan index array nya yang telah di split berdasarkan formatDate nya
            this.month = val[this._indexMonth] - 1; // mendapatkan hari sesuai dengan index array nya yang telah di split berdasarkan formatDate nya
            this.year  = val[this._indexYear]; // mendapatkan hari sesuai dengan index array nya yang telah di split berdasarkan formatDate nya
            
            this.valDay   = (this.isNormalizeValue) ? null : this.day; // set value hari sesuai dengan input
            this.valMonth = (this.isNormalizeValue) ? null : this.month; // set value bulan sesuai dengan input
            this.valYear  = (this.isNormalizeValue) ? null : this.year; // set value tahun sesuai dengan input
        }
        else
        {
            //memisahkan value tanggal
            var val = this.value.split(this._split);
            // first day console.log(new Date(dt.getFullYear(), dt.getMonth(), 1).getDate());
            // last day console.log(new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate());
            //console.log(new Date(valSplit[2], valSplit[1], valSplit[0]));\
            // jika value input sesuai dengan split pada formatDate nya
            if(val.length > 1)
            {
                this.day   = val[this._indexDay]; // mendapatkan hari sesuai dengan index array nya yang telah di split berdasarkan formatDate nya
                this.month = val[this._indexMonth] - 1; // mendapatkan hari sesuai dengan index array nya yang telah di split berdasarkan formatDate nya
                this.year  = val[this._indexYear]; // mendapatkan hari sesuai dengan index array nya yang telah di split berdasarkan formatDate nya
                
                this.valDay   = (this.isNormalizeValue) ? null : this.day; // set value hari sesuai dengan input
                this.valMonth = (this.isNormalizeValue) ? null : this.month; // set value bulan sesuai dengan input
                this.valYear  = (this.isNormalizeValue) ? null : this.year; // set value tahun sesuai dengan input
            }
            else
            {
                this.day   = this._day; // mendapatkan hari sesuai dengan index array nya yang telah di split berdasarkan formatDate nya
                this.month = this._month - 1; // mendapatkan hari sesuai dengan index array nya yang telah di split berdasarkan formatDate nya
                this.year  = this._year; // mendapatkan hari sesuai dengan index array nya yang telah di split berdasarkan formatDate nya
                
                this.valDay   = (this.isNormalizeValue) ? null : this._day; // set value hari sesuai dengan input
                this.valMonth = (this.isNormalizeValue) ? null : this._month; // set value bulan sesuai dengan input
                this.valYear  = (this.isNormalizeValue) ? null : this._year; // set value tahun sesuai dengan input
            }
        }
        return this;
    }

    //set attribute
    tgl.prototype.setAttr  = function ()
    {
        return this.attr;
    }

    // set nama bulan
    tgl.prototype.setNameMonth  = function(month)
    {
        return this.monthsName[month];
    };

    tgl.prototype.setDatePicker = function(day, isMultiDate)
    {
        var changeMonth    = (this.changeMonth === null) ? this.month : this.changeMonth,
            changeYear     = (this.changeYear === null)  ? this.year  : this.changeYear;
        
        var result         = {},
            month          = parseInt(changeMonth) + 1;
        result.month       = (month < 10) ? "0" + month : month;
        result.year        = changeYear;
        result.day         = day; // mendapatkan hari sesuai dengan hari yang ter-klik
        var value          = this._normalizeSetDatePicker(day, result.month, result.year);
        
        if(this.isMultiSetDate() && isMultiDate)
        {
            var multiDate      = this.multiDate;
            if(multiDate.indexOf(value) === -1)
            {
                
                multiDate.push(value);
            }
            else
            {
                var index = multiDate.indexOf(value);
                multiDate.splice(index, 1);
            }
            var join = multiDate.join(",");
            return join;
        }
        else
        {
            return value;
        }
    }
    tgl.prototype.__setBodyDate = function(firstDay, lastDay, cls)
    {
        var no      = 0,
            days    = "",
            s       = this._splitDefault,
            month   = (this.changeMonth === null) ? this.month : this.changeMonth,
            year    = (this.changeYear  === null) ? this.year  : this.changeYear,
            today   = (this._month - 1) + s + this._day + s + this._year,
            multiDate= this.multiDate;
        /*
            firstDay = mendapatkan jarak antara hari pertama (tanggal 1) dengan hari minggu di bulan lalu
            Contoh : 
            Minggu : 30
            Senin  : 31
            Selasa : 1 << getDay() === 2
            Rabu   : 2
        */
        
        //hari kosong di awal bulan
        // firstDay jika === 0 berarti tanggal 1 berada di hari minggu
        if (parseInt(firstDay) >= 0)
        { 
            for (var i = 0; i < parseInt(firstDay); i++)
            {
                no++;
                //hari pertama
                if (no === 1)
                { 
                    days += '<div data-date="" class="_date-inner">' + 
                                '<div class="days minggu"></div>';
                }
                //hari kedua sampai hari ke enam
                else if (no !== 7)
                {
                    days += '<div class="days"></div>';
                }
            }
        }
        for (var i = 1; i <= parseInt(lastDay); i++)
        {  
            var libur       = "", // hari libur
                title       = "", // title untuk hari libur
                getHoliday  = this._normalizeHoliday(),
                nowDay      = month + s + i + s + year,
                day   = (i < 10) ? "0" + i : i ;  // jika tanggal hari kurang dari 10 ? maka 01, 02, 03 ... 09
            no++;
            
            var nowDate             = month + s + day + s + year,
                dayMonth            = month + s + day,
                valueInput          = this.valMonth + s + this.valDay + s + this.valYear,
                permanentHolidays   = this.permanentHolidays;
            if(today === nowDay){ libur += " today";}

            // jika multiDate bernilai true
            if(this.isMultiSetDate())
            {
                for(var arr = 0; arr < multiDate.length; arr++)
                {
                    // menormalkan value multiDate ke format mm-dd-yyyy
                    var multiDate_now = this._normalizeMultiDate(multiDate[arr]);
                    if(multiDate_now === nowDate) { libur += " select"; console.log(multiDate_now); }
                }
            }
            else
            {
                if(valueInput === nowDate){ libur += " select";}
            }

            // hari libur "Holiday"
            for(var h = 0; h < getHoliday.length; h++)
            {
                var hol = getHoliday[h];
                if(hol[0].indexOf(nowDate) !== -1) 
                {
                    libur   += " holiday";
                    title   = ' title="' + hol[1] + '"';
                    
                }
            }   

            // hari libur "Permanent"
            if(typeof permanentHolidays !== "boolean")
            {
                for(var p = 0; p < permanentHolidays.length; p++)
                {
                    var perm        = permanentHolidays[p];
                        split       = perm[0].split("-");
                        _dayMonth   = parseInt(split[0]) + s + split[1];

                    if(_dayMonth === dayMonth) 
                    {
                        libur   += " holiday";
                        title   = ' title="' + perm[1] + '"';
                        
                    }
                } 
            } 
            // hari pertama
            if (no === 1)
            { 
                days += '<div data-date="" class="_date-inner">' + 
                            '<div data-day="' + day + '" class="days minggu' + libur + '"' + title + '>' + i + '</div>';
            }
            // hari kedua sampai hari ke enam
            else if (no !== 7)
            {
                days +=     '<div data-day="' + day + '" class="days' + libur + '"' + title + '>' + i + '</div>';
            }
            //hari terakhir
            else
            {
                days +=     '<div data-day="' + day + '" class="days' + libur + '"' + title + '>' + i + '</div>' + 
                        '</div>';
                no = 0; 
            }
        }
        // jika tidak ada class yang dimasukkan (class left atau right)
        var _class = (typeof cls !== 'undefined') ? ' ' + cls : "";
        var result = '<div data-date="" class="_date-container' + _class + '">' + days + '</div></div>';
        
        return result;
    };

    // apabila button right atau left ter-klik pada button hearder
    tgl.prototype._changeFullDay = function (dt) 
    {
        var data   = dt.split("-"),
            result = {
                month    : data[0], // mendapatkan bulan
                nameMonth: this.monthsName[data[0]], // mendapatkan nama bulan sesuai dengan split bulan peratma (0)
                year     : data[1] // mendapatkan tahun
            };
        return result;
    };

    // menampilkan semua nama bulan
    tgl.prototype._optionMonth = function ()
    { 
        var month = '<div class="_date-option _month">' +
                        '<div class="_option-input">' +
                            '<input placeholder="Cari Bulan...">' +
                        '</div>' +
                        '<div class="_option-container">' +
                            '<div class="_option-inner">';
        for (var i = 0; i < this.monthsName.length; i++)
        {   
            month += '<div name-month="' + this.monthsName[i].toLowerCase() + '" data-month="' + i + '" class="month">' + this.monthsName[i] + '</div>';
        }
        month += '</div></div></div>';
        return month;
    };

    // menampilkan semua tahun sesuai dengan parameters Object years
    tgl.prototype._optionYear = function ()
    { 
        var year = '<div class="_date-option _year">' +
                        '<div class="_option-input">' +
                            '<input placeholder="Cari Tahun...">' +
                        '</div>' +
                        '<div class="_option-container">' +
                            '<div class="_option-inner">';
        var loop      = this.isRangeYear,
            firstYear = this.rangeYears_1,
            lastYear  = (this.rangeYears_2 === null) ? this._year : this.rangeYears_2;
        // jika terdapat jarak antar tahun, bukan satu tahun doank
        if(loop)
        {
            var dateRange = (firstYear <= lastYear) ? true : false;
            // jarak antar tahun dimana besar kecil nya antara tahun pertama dan terakhir
            if(dateRange)
            {
                for (var i = firstYear; i <= lastYear; i++)
                { 
                    year += '<div data-year="' + i + '" class="year">' + i + '</div>';
                }
            }
            else
            {
               
                for (var i = firstYear; i >= lastYear; i--)
                { 
                    year += '<div data-year="' + i + '" class="year">' + i + '</div>';
                }
            }
        }
        else
        {
            year += '<div data-year="' + firstYear + '" class="year">' + firstYear + '</div>';
        }
        year += '</div></div></div>';
        return year;
    };

    // set menit pada parameters object "minutes"
    tgl.prototype._setTimes = function (type)
    {
        var result  = "",
            minutes = this.dataMinutes,
            hours   = this.dataHours;
        if(type === 'minutes')
        {
            if(typeof minutes === 'string')
            {
                var min = minutes.split("-"),
                    arr = new Array();
                for(var i = min[0]; i <= min[1]; i++)
                {
                    var ini_minute = (min[0] >= 60) ? 59 : i;
                    arr.push(ini_minute);
                }
                result = arr;
            }
            else if(typeof minutes === 'object')
            {
                var arr = new Array();
                for(var i = 0; i < minutes.length; i++)
                {
                    var ini_minute = (minutes[i] >= 60) ? 59 : minutes[i];
                    arr.push(ini_minute);
                }
                result = arr;
            }
        }
        else
        {
            if(typeof hours === 'string')
            {
                var hour        = hours.split("-"),
                    _hour_start = parseInt(hour[0]),
                    _hour_end   = parseInt(hour[1]),
                    arr         = new Array();
                for(var i = _hour_start; i <= _hour_end; i++)
                {
                    var ini_hour = (i >= 24) ? 23 : i;
                    arr.push(ini_hour);
                }
                result = arr;
                
            }
            else if(typeof hours === 'object')
            {
                var arr = new Array();
                for(var i = 0; i < hours.length; i++)
                {
                    hours[i] = (hours[i] >= 24) ? 23 : hours[i];
                    arr.push(hours[i]);
                }
                result = arr;
            }
        }
        
        return result;
    };

    // set posisi element arjunane sesuai dengan element selected
    tgl.prototype.setPosition = function ()
    { 
        var pos = this._pos,
            left    = 0,
            top     = 0,
            height  = this.elem.outerHeight(), // tinggi elemeng arjunane-date
            width   = this.elem.outerWidth(), // tinggi elemeng arjunane-date
            maxTop  = pos.pageY + pos.height,
            maxLeft = pos.pageX + pos.width;
        //jika posisi arjunane-date lebih kebawah dari posisi element input (melebihi batas bawah)
        if(maxTop > pos.top) { top = pos.top + pos.elemHeight;}
        else                 { top = pos.top - height;}

        //jika posisi arjunane-date lebih ke kanan dari posisi element input (melebihi batas kanan)
        if(maxLeft > pos.left) { left = pos.left;}
        else                   { left = pos.left - pos.elemWidth;}

        this.elem[0].style.left = left + "px";
        this.elem[0].style.top  = top + "px";
        return this;
    };

    // validasi nama hari + singkatan nya (parameters object)
    tgl.prototype._validDaysNames = function (days)
    { 
        var result = true;
        if (days.length === 7)
        { 
            for (var i = 0; i < days.length; i++)
            {
                // jika nama hari nya tidak terdapat singkatannya, maka bernilai false
                if (days[i].length !== 2) result = false;
            }
        }
        return result;
    };

    tgl.prototype._validTime      = function(time)
    {
        var result = true;
        if(typeof time === 'string')
        {
            var val = time.split("-");
            if(val.length !== 2) { result = false;}
        }
        else if(typeof time !== 'boolean' && typeof time !== 'object')
        {
            result = false;
        }
        return result;
    }

    // validasi waktu
    tgl.prototype._validFormatTime = function(formatTime)
    {
        return (HELPER.formatTime.indexOf(formatTime) !== -1) ? true : false;
    };

    // validasi showDate (menampilkan body tanggal dan body waktu)
    tgl.prototype._validShowDate  = function (show)
    {
        if(show !== null)
        {
            for(var i = 0; i < show.length; i++)
            {
                if(typeof show[i] !== 'boolean') return false;
            }
            if(show.length > 2){ return false;}
        }
        return true;
    };

    tgl.prototype._validPermanentHolidays = function(pHoliday)
    {
        var result = false;
        for(var i = 0; i < pHoliday.length; i++)
        {
            var split = pHoliday[i][0].split("-");
            if(split.length === 2 && typeof pHoliday[i][0] === 'string' && typeof pHoliday[i][1] === 'string')
            {
                result = true;
            }
        }
        return result;
    };  

    tgl.prototype._validRangeYears = function (years)
    {
        var result  = true,
            split   = years.split(":"),
            oneYear = years.split("_");
        
        for(var i = 0; i < split.length; i++)
        {
            // check apakah bertipe number, jika bukan number maka isNaN TRUE
            if(isNaN(split[i]))
            {
                result = false;
            }
        }
        // jika tidak ada jarak antar tahun (hanya satu tahun)
        if(split.length === 1 && oneYear.length === 2) 
        {
            this.isRangeYear = false;
            result = true;
        }
        // jika hasil split lebih dari 2
        if(split.length > 2) {result = false;}


        return result;
    };

    tgl.prototype._validMultiSetDate = function(params)
    {
        if(typeof params === 'boolean') { return params; }
        return false;
    };

    tgl.prototype._validFormatDate = function (formatDate)
    {
        return (HELPER.formatDate.indexOf(formatDate) !== -1) ? true : false;
    };

    tgl.prototype._validHoliday = function (holiday)
    {
        var result = true;
        if(typeof holiday !== 'boolean')
        {
            for(var i = 0; i < holiday.length; i++)
            {
                if(holiday[i].length !== 2) result = false;
            }
        }
        else
        {
            result = false;
        }
        return  result;
    }

    tgl.prototype._validMonthsNames = function (month)
    { 
        return (month.length === 12) ? true : false;
    };

    tgl.prototype._validDate = function (val)
    { 
        //isNaN merupakan sebuah fungsi yang memeriksa apakah value bernilai number, jika false maka value bernilai number, dan sebaliknya
        return (!isNaN(new Date(val).getTime())) ? true : false;
    };

    //mendapatkan posisi input (element selected)
    tgl.prototype.position = function (pos)
    {
        this._pos = pos;
        return this;
    };

} ) );