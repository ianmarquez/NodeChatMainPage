$.fn.table = function(options){

    var appendtable = $(this);
    var appendtabletr = "#" + $(this).attr("id") + " tr";

    var opts = $.extend({
      pagenum: 0,
      perpage: 5,
      numofpaging: 5,
      data_array: [],
      trevent:undefined,
      columns: [],
      tableformat: 'class="table table-striped"',
      tbodyformat: '',
      theadformat: '',
      header: '',
      totalresults: true,
      pagination: true,
      sortable: false,
      resizablecolumn: false
  },options);

    var colspan = opts.columns.length;

    var datarow = '';
    var total_results = opts.data_array.length;

    var total_pages = Math.ceil(total_results / opts.perpage);
    var offset = parseInt(opts.pagenum * opts.perpage);
    var itemindex = ((opts.pagenum * opts.perpage) + opts.perpage );

    if(opts.header != '') {
      datarow += '  <h3 colspan="'+ colspan +'" align="center" class="form-control-static">'+opts.header+'</h3>';
    }

  datarow += '<table ';
  if(opts.tableformat != '') {
      datarow += opts.tableformat;
  }
  datarow += ' >';

            // head
            datarow += ' <thead ';
            if(opts.tbodyformat != '') {
              datarow += opts.theadformat;
          }
          datarow += ' >';
          for (var i = 0; i < colspan ; i++) {
              datarow += '    <th ';
              if(opts.columns[i].thformatter != undefined) {
                datarow += opts.columns[i].thformatter;
            }
            datarow += '    >';
            datarow += opts.columns[i].title +'</th>';
        };
        datarow += ' </thead>';

    if(opts.data_array.length > 0){
          var newArray = opts.data_array.slice(offset, itemindex);

                // body
                datarow += ' <tbody ';
                if(opts.tbodyformat != '') {
                  datarow += opts.tbodyformat;
              }
              datarow += ' >';
              for (var key in newArray) {
                  if (newArray.hasOwnProperty(key)) {
                    var valueArray = newArray[key];

                    var trapp = '';
                    if(opts.columns[0].trformatter != undefined) {
                        trapp += opts.columns[0].trformatter;
                    }

                    datarow += ' <tr '+trapp+'>';

                    for (var i = 0; i < colspan ; i++) {
                      datarow += '    <td ';
                      if(opts.columns[i].tdformatter != undefined) {
                        datarow += opts.columns[i].tdformatter;
                    }
                    datarow += '    >';
                    if (opts.columns[i].formatter != undefined) {
                        var datas = opts.columns[i].formatter(valueArray);
                        datarow += datas;
                    }
                    else {
                        if (valueArray[opts.columns[i].field] != null) {
                            datarow += valueArray[opts.columns[i].field];
                        }
                    }
                    datarow += '</td>';
                };
                datarow += ' </tr>';
            };
        };
        datarow += ' </tbody>';

        datarow += ' </table>';
        if (opts.totalresults) {
          var newii = itemindex;
            if (itemindex>total_results) {
                newii=total_results;
            }
            if (opts.totalresults && total_results>opts.perpage) {
                datarow += ' <div class="col-sm-4"><span class="totalresults">'+(offset+1)+' to '+newii+' of '+total_results + ' results</span></div>';
            }
        }
    if (opts.pagination && total_results>opts.perpage) {
      datarow += ' <div class="col-sm-8"><div id="pagination" class="text-center pull-right"></div></div>';
    }

} else{
    datarow += '<tr><td colspan="'+colspan+'" align="center">No results</td></tr>';
    appendtable.find(".totalresults").empty();
    appendtable.find("#pagination").empty();
};
appendtable.empty().append(datarow);
appendtable.find("#pagination").pagination(total_results,{
    items_per_page:opts.perpage,
    current_page:opts.pagenum,
    num_display_entries:opts.numofpaging,
    callback:function(page){
      opts.pagenum = page;
      appendtable.itable(opts);
  }
});

