lm_app.pcs = {
    choices : function() {
        /*
        These are the types of entries possible when building the character sheet template.
        */
        var choices = [
            {
                "form_field_visible_description" : "Character Sheet Section Title",
                "form_field_value" : "section_title"
            },
            {
                "form_field_visible_description" : "Single Line of Text",
                "form_field_value" : "single_line"
            },
            {
                "form_field_visible_description" : "Text Box",
                "form_field_value" : "text_box"
            }
        ];
        return choices;
    },
    /*
    This outputs the html form that shows the character sheet.
    */
    html : function(template, pc) {
        var html = "<div class=\"row\"><span class=\"col-xs-12\"><p class=\"lead\">" + template.data[0][1] + "</p></span></div>";
        for(var i=0;template.data.length>i;i++) {
            if(i == 0) {
                html += "<div class=\"row\"><span class=\"col-xs-12\"><div class=\"well\"><form class=\"form-horizontal\" role=\"form\">";
            };
            var field = template.data[i];
            switch(template.data[i][0]) {
                case "section_title":
                    html+="<b>" + field[1] + "</b>";
                    break;
                case "single_line":
                    html+='<div class="form-group"><label class="control-label" for="field_' + i + '">' + field[1] + '</label><div class="controls"><input class="pc_field form-control" id="field_' + i + '" class="form-control" type="text" value="' + pc.data[i] + '"></div></div>';
                    break;
                case "text_box":
                    html+='<div class="form-group"><label class="control-label" for="field_' + i + '">' + field[1] + '</label><div class="controls"><textarea class="pc_field form-control" id="field_' + i + '" class="form-control" rows="' + field[2] + '">' + pc.data[i] + '</textarea></div></div>';
                    break;
            };
            if(i == (template.data.length - 1 )) {
                html+="</form></span></div>";
            };
        };
        return html;
    },
    /*
    This outputs a live preview of the template as it's being built.
    */
    template_preview_html : function(template) {
        var html = "<div class=\"row\"></div>";
        html += "<div class=\"row\"><span class=\"col-xs-12\"><div class=\"well\"><form class=\"form-horizontal\" role=\"form\">";
        for(var i=0;template.length>i;i++){
            switch(template[i][0]) {
                case "section_title":
                    html+="<b>" + template[i][1] + "</b>";
                    break;
                case "single_line":
                    html+='<div class="form-group"><label class="control-label" for="field_' + i + '">' + template[i][1] + '</label><div class="controls"><input class="pc_field form-control" id="field_' + i + '" class="form-control" type="text"></div></div>';
                    break;
                case "text_box":
                    html+='<div class="form-group"><label class="control-label" for="field_' + i + '">' + template[i][1] + '</label><div class="controls"><textarea class="pc_field form-control" id="field_' + i + '" class="form-control" rows="10"></textarea></div></div>';
                    break;
            };
        };
        html+= "</form></span></div>";
        return html;
    },
    gm_view_html : function(template, pc) {
        var html = "<div class=\"row\"></div>";
        for(var i=0;template.data.length>i;i++) {
            if(i == 0) {
                html += "<div class=\"row\"><span class=\"col-xs-12\"><div class=\"well\"><form class=\"form-horizontal\" role=\"form\">";
            };
            var field = template.data[i];
            switch(template.data[i][0]) {
                case "legend_start":
                    html+="<fieldset><legend>" + field[1] + "</legend>";
                    break;
                case "legend_end":
                    html+="</fieldset>";
                    break;
                case "single_line":
                    html+='<div class="form-group"><label class="control-label" for="field_' + i + '">' + field[1] + '</label><div class="controls"><input class="pc_field form-control" id="field_' + i + '" class="form-control" type="text" value="' + pc.data[i] + '"></div></div>';
                    break;
                case "multi_line":
                    if(field[2]) {
                        var rows = field[2];
                    } else {
                        var rows = "5";
                    };
                    html+='<div class="form-group"><label class="control-label" for="field_' + i + '">' + field[1] + '</label><div class="controls"><textarea class="form-control" id="field_' + i + '" rows="' + rows + '"></textarea></div></div>';
                    break;
            };
            if(i == (template.data.length - 1 )) {
                html+="</form></span></div>";
            };
        };
        return html;
    }
};
