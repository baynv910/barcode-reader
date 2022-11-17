navigator.mediaDevices.enumerateDevices().then((devices) => {
    let id = devices.filter((device) => device.kind === "videoinput").slice(-1).pop().deviceId;
    let constrains = { video: { optional: [{ sourceId: id }] } };

    navigator.mediaDevices.getUserMedia(constrains).then((stream) => {
        let capturer = new ImageCapture(stream.getVideoTracks()[0]);
        step(capturer);
    });
});

const addToResults = (barcodes) => {
    //barcodes = document.querySelector('#barcodes').innerText;

    // check if barcode has been scanned?
    if (barcodes == "") {
        alert("No scanned barcode found!");
    }
    else {
        let today = new Date();
        let dateTime = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear() +' '+ today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const node = document.createElement("tr");
        const nodeChild1 = document.createElement("td");
        nodeChild1.appendChild(document.createTextNode(dateTime));
        node.appendChild(nodeChild1);

        const nodeChild2 = document.createElement("td");
        nodeChild2.appendChild(document.createTextNode(barcodes));
        node.appendChild(nodeChild2);

        const nodeChild3 = document.createElement("td");
        nodeChild3.appendChild(document.createTextNode(document.querySelector('#gfg').innerText));
        node.appendChild(nodeChild3);

        let resList = document.querySelector('#res-list').appendChild(node);
    }

}

function step(capturer) {
    capturer.grabFrame().then((image) => {
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
        const barcodeDetector = new BarcodeDetector({
            formats: [
                'aztec',
                'code_128',
                'code_39',
                'code_93',
                'codabar',
                'data_matrix',
                'ean_13',
                'ean_8',
                'itf',
                'pdf417',
                'qr_code',
                'upc_a',
                'upc_e',
            ],
        });

        barcodeDetector.detect(image)
            .then(barcodes => {
                //document.getElementById("barcodes").innerHTML = barcodes.map(barcode => barcode.rawValue).join(', ');
                addToResults(barcodes.map(barcode => barcode.rawValue).join(', '));
                step(capturer);
            })
            .catch((e) => {
                console.error(e);
            }); 000
    });
}


function download_table_as_csv(table_id, separator = ',') {
    // Select rows from table_id
    var rows = document.querySelectorAll('table#' + table_id + ' tr');
    // Construct csv
    var csv = [];
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll('td, th');
        for (var j = 0; j < cols.length; j++) {
            // Clean innertext to remove multiple spaces and jumpline (break csv)
            var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
            // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
            data = data.replace(/"/g, '""');
            // Push escaped string
            row.push('"' + data + '"');
        }
        csv.push(row.join(separator));
    }
    var csv_string = csv.join('\n');
    // Download it
    var filename = 'export_' + table_id + '_' + new Date().toLocaleDateString() + '.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}