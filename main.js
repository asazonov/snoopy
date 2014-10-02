//requirejs.config({
//    baseUrl: 'lib',
//    paths: {
//        app: '../app'
//    }
//});

window.onload = function() {
    // Listen for button to load files
    document.getElementById("fileLoaded").addEventListener("change", loadFiles, false);
    // Listen for butoon to load the dalliance viwer
    document.getElementById("loadDalliance").addEventListener("click", loadDalliance, false);
    //Licsten for quality control
//    document.getElementById("qcDecision").addEventListener("click", setQC, false);

};
var b = new Browser({
    chr:          '22',
    viewStart:    30000000,
    viewEnd:      30000100,
    cookieKey:    'human-grc_h37',

    coordSystem: {
        speciesName: 'Human',
        taxon: 9606,
        auth: 'GRCh',
        version: '37',
        ucscName: 'hg19',
    },

    chains: {
        hg18ToHg19: new Chainset('http://www.derkholm.net:8080/das/hg18ToHg19/', 'NCBI36', 'GRCh37',
                                 {
            speciesName: 'Human',
            taxon: 9606,
            auth: 'GRCh',
            version: 37
        })
    },

    /*noTrackAdder : true,
    noLeapButtons : true,
    noLocationField : true,
    noZoomSlider : true,
    noTitle : true,
    noTrackEditor : true,
    noExport : true,
    noOptions : true,
    noHelp : true,
    disableDefaultFeaturePopup : true,i*/
    noPersist : true,
    noPersistView : true,
    sources: [
        {name: 'Genome',
            twoBitURI: 'http://www.biodalliance.org/datasets/hg19.2bit',
                tier_type: 'sequence',
            provides_entrypoints: true,
            pinned: true
    }],
    setDocumentTitle: true,
    //uiPrefix: 'file:///home/daniel/repositories/snpshow/dalliance/',
    uiPrefix: 'file:///Users/dr9/Developer/snpshow/dalliance/',
        fullScreen: false,

    browserLinks: {
        Ensembl: 'http://ncbi36.ensembl.org/Homo_sapiens/Location/View?r=${chr}:${start}-${end}',
            UCSC: 'http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19&position=chr${chr}:${start}-${end}',
                Sequence: 'http://www.derkholm.net:8080/das/hg19comp/sequence?segment=${chr}:${start},${end}'
    }
});

b.hubs = [
    'http://www.biodalliance.org/datasets/testhub/hub.txt',
        'http://ftp.ebi.ac.uk/pub/databases/ensembl/encode/integration_data_jan2011/hub.txt'
];

b.addFeatureInfoPlugin(function(f, info) {
    info.add('Testing', 'This is a test!');
});


/*
b.addViewListener(function(chr, min, max) {
var link = document.getElementById('enslink');
link.href = 'http://www.ensembl.org/Homo_sapiens/Location/View?r=' + chr + ':' + min + '-' + max;
});
/*var geneDescriptions;
connectBigTab(new URLFetchable('http://www.biodalliance.org/datasets/ensg-to-desc.bt'), function(bt) {
geneDescriptions = bt;
});

b.addFeatureInfoPlugin(function(f, info) {
if (f.geneId) {
var desc = makeElement('div', 'Loading...');
info.add('Description', desc);
geneDescriptions.index.lookup(f.geneId, function(res, err) {
if (err) {
console.log(err);
} else {
desc.textContent = res;
}
});
}
}); */


function LoadedFile(file) {
    this.file = file || null;
}

LoadedFile.prototype.print = function(message) {
}


function LoadedBamFile(file) {
    this.base = LoadedFile;
    this.base(file);
    this.index = null;
}

LoadedBamFile.prototype = new LoadedFile;

LoadedBamFile.prototype.print = function(index) {
    var str = "<tr><td>";
    str += this.file.name;
    str += "</td><td>";
    if (!this.index) {
        str += "Missing index file";
    } else {
        str += "Index loaded";
    }
    str += "</td><td><a href=\"#\" onclick=\"removeBAM(";
                                                       str += String(index);
                                                       str += "); return false;\"> <span class=\"glyphicon glyphicon-trash\"></span></a></td></tr>";
                                                       return str
}

function LoadedBaiFile(file) {
    this.base = LoadedFile;
    this.base(file);
}

function removeBAM(index) {
    if (typeof(index) === "string") {
        index = parseInt(index);
    }
    bamFiles.splice(index, 1);
    printFilesTable();
}

LoadedBaiFile.prototype = new LoadedFile;

LoadedBaiFile.prototype.print = function(index) {
    var str = "<tr><td>";
    str += this.file.name;
    str += "</td><td>";
    str += "Missing BAM file";
    str += "</td><td><a href=\"#\" onclick=\"removeBAI("
                                                       str += String(index)
                                                       str += "); return false;\"> <span class=\"glyphicon glyphicon-trash\"></span></a></td></tr>";
                                                       return str
}

function removeBAI(index) {
    if (typeof(index) === "string") {
        index = parseInt(index);
    }
    baiFiles.splice(index, 1);
    printFilesTable();
}



//LoadedBaiFile.prototype.print = function() {
//    this.__proto__.print("No BAM File Found");
//}

function LoadedVariantFile(file) {
    this.base = LoadedFile;
    this.base(file);
}

LoadedVariantFile.prototype = new LoadedFile;

//LoadedVariantFile.prototype.print = function() {
//    return this.file.name;
//}


LoadedVariantFile.prototype.print = function(index) {
    var str = "<tr><td>";
    str += this.file.name;
    str += "</td><td>";
    str += "</td><td><a href=\"#\" onclick=\"removeVariantFile("
                                                               str += String(index)
                                                               str += "); return false;\"> <span class=\"glyphicon glyphicon-trash\"></span></a></td></tr>";
                                                               return str
}

function removeVariantFile(index) {
    if (typeof(index) === "string") {
        index = parseInt(index);
    }
    variantFiles.splice(index, 1);
    printFilesTable();
}
function LoadedFilesList(files) {
    this.files = files || [];
}

LoadedFilesList.prototype.contains = function(file) {
    for (var i=0; i < this.files.length; ++i) {
        if (this.files[i].name === file.name) {
            return true;
        }
    }
    return false;
}

LoadedFilesList.prototype.add = function(file) {
    this.files.push(file)
}

LoadedFilesList.prototype.length = function() {
    return this.files.length;
}

var getExtension = function(file) {
    var parts = file.name.split(".");
    return parts[parts.length - 1].toLowerCase();
};

var fileArrayContains = function(fArray, fname) {
    for (var i=0; i < fArray.length; ++i) {
        var f = fArray[i];      
        if (f.file.name === fname) {
            return i;
        }
    }
    return -1;
};

var printfArray = function(fArray) {
    var str = ""
    for (var i=0; i < fArray.length; ++i) {
        str += fArray[i].print(i);
    }
    return str;
}


function variantLocations(variantFile) {
    this.variantArray = [];
    this.current = 0;
}


variantLocations.prototype.updateByList = function() {
    this.setQC();
    var selected = document.getElementById("mySelect");
    console.log(selected);
    this.current = selected.value;
    this.gotoCurrentVariant();
}

function setQC() {
    console.log("hello");
   console.log(parseInt(decision)); 
    v.setQC(parseInt(decision));
}

variantLocations.prototype.setQC = function() {
    console.log("setQC");
    var decision = $("#qcDecision input:radio:checked").val();
    if (decision !== undefined) {
        this.variantArray[this.current][2] = parseInt(decision);
        $("#qcDecision input:radio:checked").prop("checked", false);
        $("#qcDecision label").removeClass("active");
        this.refreshSelectList();
    }
}

variantLocations.prototype.processVariantFile = function(fileText) {
    var textArray = fileText.split("\n");
    var pattern = /\s*[-:,\s]+\s*/
for (i = 0; i < textArray.length; i++) {
    var variant = textArray[i].trim();
    var parts = variant.split(pattern);
    var chr = parseInt(parts[0]);
    var loc = parseInt(parts[1]); 
    if (parts.length === 2) {
        this.variantArray.push([chr, loc, -99]);
    }
}



//var option = document.getElementById("").options[0];
//option.value = option.text = getYear();
};

variantLocations.prototype.refreshSelectList = function() {

    var stringArray = this.getStringArray();
    var selectList = document.getElementById("mySelect"); 
    selectList.innerHTML = "";

    //Create and append the options
    for (var i = 0; i < stringArray.length; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = stringArray[i];
        selectList.appendChild(option);
    }
};

variantLocations.prototype.getStringArray = function() {
    var stringArray = Array(this.variantArray.length);
    for (i = 0; i<this.variantArray.length; i++) {
        var s = this.variantArray[i][0] + ":" + this.variantArray[i][1];
        switch (this.variantArray[i][2]) {
            case -1:
                s += " - not a variant";
            break;
            case 0:
                s += " - maybe a variant";
            break;
            case 1:
                s += " - variant";
            break;
        }
        stringArray[i] = s;
    }
    return stringArray;
};

variantLocations.prototype.gotoCurrentVariant = function() {
    console.log(this.current);
    console.log(this.variantArray); 
    var c = this.variantArray[this.current];
    document.getElementById("currentVariant").innerHTML = String(c[0]) + " : " + String(c[1]);
    b.setLocation("chr" + c[0], c[1] - 55, c[1] + 55);
    b.zoomStep(-1000000);
    document.getElementById("mySelect").value = this.current;

    
};

variantLocations.prototype.next = function() {
    this.setQC();
    if (this.current < this.variantArray.length - 1) {
        this.current++;
        this.gotoCurrentVariant();
    }
};

variantLocations.prototype.prev = function() {
    this.setQC();
    if (this.current > 0) {
        this.current--;
        this.gotoCurrentVariant();

    }
};


var bamFiles = [];
var baiFiles = [];
var variantFiles = [];

function printFilesTable() {
    var str = printfArray(bamFiles);
    str += printfArray(baiFiles);
    str += printfArray(variantFiles);
    document.getElementById("loadedFilesTable").innerHTML = str;
    if (bamFiles.length + baiFiles.length + variantFiles.length === 0) {
        document.getElementById("loadedFilesPanel").setAttribute("style", "display:none");
        document.getElementById("loadDalliance").setAttribute("style", "display:none");
        //document.getElementById("loadFiles").setAttribute("style", "margin-top: 20px");
    } else {
        document.getElementById("loadedFilesPanel").setAttribute("style", "display:block");
        document.getElementById("loadDalliance").setAttribute("style", "display:inline");
        //document.getElementById("loadFiles").setAttribute("style", "margin-top: 0px");


    }


}


function loadFiles() {
    console.log("I'm here now");
    var files = document.getElementById("fileLoaded").files;
    for (var i=0; i < files.length; ++i) {
        var f = files[i];
        switch (getExtension(f)) {
            case "bam":
                var newBam = new LoadedBamFile(f);
            bamFiles.push(newBam);
            break;
            case "bai":
                var newBai = new LoadedBaiFile(f);
            baiFiles.push(newBai);
            break;
            case "txt":
                var newVariant = new LoadedVariantFile(f);
            variantFiles.push(newVariant);
            break;
        }
    }

    for (var i=0; i < bamFiles.length; ++i) {
        console.log(i);
        var baiEquivName = bamFiles[i].file.name + ".bai";
        var baiIndex = fileArrayContains(baiFiles, baiEquivName);
        if (baiIndex >= 0) {
            bamFiles[i].index = baiFiles.splice(baiIndex, 1)[0];
        }
    }
    printFilesTable();

    /* console.log(BAMfile);
    console.log(BAIfile);
    console.log(variantFile);

    var reader = new FileReader();
    reader.readAsText(variantFile);
    reader.onload = function() {
    console.log(reader.result);
    v.processVariantFile(reader.result);
    v.gotoCurrentVariant();
    }

    var myBAM = {
    baiBlob : BAIfile,
    bamBlob : BAMfile,
    name : "example",
    noPersist : true,
    };

    b.addTier(myBAM);
*/
    resetFileLoaded();
};

function resetFileLoaded() {
    var oldFileLoad = document.getElementById("fileLoaded");
    var newFileLoad = makeElement('input', null, {id: 'fileLoaded', type: 'file', multiple: 'multiple'});
    newFileLoad.addEventListener("change", loadFiles, false);
    var father = oldFileLoad.parentNode;
    console.log(father);
    father.replaceChild(newFileLoad, oldFileLoad); 
}

var v = new variantLocations();

function loadDalliance() {
    for (var i=0; i < bamFiles.length; ++i) {
        var bamFile = bamFiles[i];
        console.log(bamFile.index.file); 
        var bamObj = {
            baiBlob : bamFile.index.file,
            bamBlob : bamFile.file,
            name : bamFile.file.name, 
            noPersist : true,
        }
        console.log(bamObj);
        b.addTier(bamObj);
    }
    //Create and append select list
    var myDiv = document.getElementById("variantSelectListHolder");
    var selectList = document.createElement("select");
    selectList.id = "mySelect";
    selectList.className = "form-control";
    selectList.size = 10;
    selectList.onchange = function(){v.updateByList();};
    myDiv.appendChild(selectList);



    var reader = new FileReader();
    reader.readAsText(variantFiles[0].file);
    reader.onload = function() {
        console.log(reader.result);
        v.processVariantFile(reader.result);
        v.gotoCurrentVariant();
        v.refreshSelectList();
    }
    setTimeout(function(){b.zoomStep(-1000000)}, 1000);    
    document.getElementById("fileLoader").setAttribute("style", "display: none");
    document.getElementById("control-center").setAttribute("style", "display: block");
    document.getElementById("bigSpacer").setAttribute("style", "display: none");
}
