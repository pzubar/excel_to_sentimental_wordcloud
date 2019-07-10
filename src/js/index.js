var dropArea = document.querySelector("#root");

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
});
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
});
['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
});

function highlight() {
    dropArea.classList.add('highlight')
}

dropArea.addEventListener('click', function () {
    var myConfig = {
        "graphset": [
            {
                "type": "wordcloud",
                options: {
                    style: {
                        fontFamily: 'Arial',
                        fontWeight: getRandomIntInclusive(0, 1) ? 'bold': 'normal',
                    },
                    stepAngle: getRandomIntInclusive(30, 300),
                    words: window.chart_series
                }
            }
        ]
    }
    zingchart.render({
        id: 'root',
        graphid: 0,
        data: myConfig,
        height: '100%',
        width: '100%'
    });
});
function unhighlight(e) {
    dropArea.classList.remove('highlight')
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function handleDrop(e) {
    var files = e.dataTransfer.files, f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        try {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: 'array' });
            var first_sheet_name = workbook.SheetNames[0];
            var data_array = XLS.utils.sheet_to_json(workbook.Sheets[first_sheet_name]);
            window.chart_series = data_array.map(({ Word, Weight, Positive }) => ({ text: Word, count: Weight, color: (Positive ? "#32be82" : "#e6463c") }))
            var myConfig = {
                "graphset": [
                    {
                        "type": "wordcloud",
                        
                        options: {
                            stepAngle: getRandomIntInclusive(30, 300),
                            words: window.chart_series,
                            style: {
                                fontFamily: 'Arial',
                                fontWeight: getRandomIntInclusive(0, 1) ? 'bold': 'normal',
                            },
                        }
                    }
                ]
            };
            zingchart.render({
                id: 'root',
                graphid: 0,
                data: myConfig,
                height: '100%',
                width: '100%'
            });
        }
        catch (e) {
            debugger;
            alert("An error occurred!");
        }
    };
    reader.readAsArrayBuffer(f);
}
dropArea.addEventListener('drop', handleDrop, false);