'use strict';

function render(){
    var href = document.location.href;
    if (href.indexOf('?usePdf') > -1){
        renderPdf();
    }
    else{
        document.getElementById('the-image').style.display = 'block';
        runQuagga('barcode.png');
    }
}

function renderPdf(){
    document.getElementById('the-canvas').style.display = 'block';

// Fetch the PDF document from the URL using promises.
    PDFJS.getDocument('barcode.pdf').then(function (pdf) {
        // Fetch the page.
        pdf.getPage(1).then(function (page) {
            var scale = 1.5;
            var viewport = page.getViewport(scale);

            // Prepare canvas using PDF page dimensions.
            var canvas = document.getElementById('the-canvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context.
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext);

            var dataUrl = canvas.toDataURL();

            runQuagga(dataUrl);
        });
    });
}

function runQuagga(imageSrc) {

    var config = {
        locator: {
            patchSize: "x-large",
            halfSample: true,
            debug: {
                showCanvas: true,
                showPatches: true,
                showFoundPatches: true,
                showSkeleton: true,
                showLabels: true,
                showPatchLabels: true,
                showRemainingPatchLabels: true,

                boxFromPatches: {
                    showTransformed: true,
                    showTransformedBox: true,
                    showBB: true
                }
            }
        },
        decoder: {
            readers: ["code_39_reader"],
            debug: {
                drawBoundingBox: true,
                drawScanline: true,
                showPattern: true
            }
        },
        numOfWorkers: 0,
        src: imageSrc,
        debug: true
    };

    Quagga.decodeSingle(config, function (result) {
        console.log("Decode result: ", result);
    });
}
